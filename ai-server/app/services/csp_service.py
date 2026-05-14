"""
CSP 시간표 최적화 엔진
======================
OR-Tools CP-SAT 솔버를 사용하여 제약 조건을 만족하는
최적 시간표 Plan A/B/C를 생성.

기본 제약 조건 (무조건 적용):
  1. 시간 충돌 방지
  2. 기수강 과목 제외
  3. 장바구니 고정
  4. 학점 범위 제약
  5. 이동시간 10분 초과 차단
  6. 같은 과목 분반 중복 방지

사용자 입력 제약 조건 (우선순위 기반 가중치):
  1. 공강 요일
  2. 오르막 회피 여부
  3. 온라인 강의 선호도
  4. 오전 수업 선호도
"""

import re
from ortools.sat.python import cp_model

from app.services.data_loader import load_courses, load_distances
from app.services.curriculum import get_curriculum_courses
from app.schemas.csp_schema import (
    CSPRequest, CSPResponse, TimetablePlan, ScheduleItem, ConflictInfo
)


# ==========================================================
# 상수
# ==========================================================

LIBERAL_ARTS_CLASSIFICATIONS = {"교필", "교선", "계교"}

# 우선순위 순서에 따른 가중치 (1순위=4, 2순위=3, 3순위=2, 4순위=1)
PRIORITY_WEIGHTS = {0: 4, 1: 3, 2: 2, 3: 1}

def get_priority_label(key: str, request: CSPRequest) -> str:
    """
    우선순위 키 + 사용자 설정에 맞는 한국어 라벨 생성.
    
    예시:
    - FREE_DAY + free_days=["금"] → "금요일 공강"
    - PREFER_MORNING + preferred_time="AFTERNOON" → "오후 수업"
    """
    if key == "FREE_DAY":
        if request.free_days:
            days = ", ".join(request.free_days)
            return f"{days}요일 공강"
        return "공강 요일"
    
    if key == "AVOID_UPHILL":
        return "오르막 회피"
    
    if key == "PREFER_ONLINE":
        return "온라인 강의"
    
    if key == "PREFER_MORNING":
        if request.preferred_time == "MORNING":
            return "오전 수업"
        elif request.preferred_time == "AFTERNOON":
            return "오후 수업"
        return "선호 시간대"
    
    return key


# ==========================================================
# 유틸 함수
# ==========================================================

def get_priority_weight(priority_order: list[str], key: str) -> int:
    """사용자 우선순위 리스트에서 해당 key의 가중치 반환"""
    if not priority_order or key not in priority_order:
        return 1
    idx = priority_order.index(key)
    return PRIORITY_WEIGHTS.get(idx, 1)

def get_plan_profiles(request: CSPRequest) -> dict:
    """
    사용자 우선순위에 따라 3개 plan의 가중치 프로파일 생성.
    
    Plan A: 1순위만 압도적으로 강하게
    Plan B: 2순위만 압도적으로 강하게
    Plan C: 1, 2, 3순위 골고루 (균형형)
    """
    priority_order = (
        request.priority_order 
        if hasattr(request, 'priority_order') and request.priority_order 
        else []
    )
    
    # 사용자 우선순위 기반 기본 가중치
    # 1순위 4, 2순위 3, 3순위 2, 4순위 1
    base = {"FREE_DAY": 1, "AVOID_UPHILL": 1, "PREFER_ONLINE": 1, "PREFER_MORNING": 1}
    for i, key in enumerate(priority_order):
        base[key] = 4 - i  # 1순위=4, 2순위=3, ...
    
    # Plan별 가중치 (base에 추가 강화)
    p1 = priority_order[0] if len(priority_order) > 0 else "FREE_DAY"
    p2 = priority_order[1] if len(priority_order) > 1 else "AVOID_UPHILL"

    # Plan A: 1순위만 압도적 (base의 1순위 가중치를 크게 곱하기)
    plan_a_weights = base.copy()
    plan_a_weights[p1] = 20

    # Plan B: 2순위만 압도적
    plan_b_weights = base.copy()
    plan_b_weights[p2] = 20

    # Plan C: base 그대로 유지 (=사용자 우선순위 자연스럽게 반영)
    plan_c_weights = base.copy()

    return {
        "A": {
            "label": f"{get_priority_label(p1, request)} 우선",
            "weights": plan_a_weights,
        },
        "B": {
            "label": f"{get_priority_label(p2, request)} 우선",
            "weights": plan_b_weights,
        },
        "C": {
            "label": "균형형",
            "weights": plan_c_weights,
        },
    }

def is_specific_major_liberal(course: dict) -> bool:
    """학과명+학년 형태 organization을 가진 계교 강의 판별"""
    if course["classification"] != "계교":
        return False
    org = course.get("organization", "")
    if not org:
        return False
    if "리버럴아츠칼리지" in org:
        return False
    return bool(re.search(r'[1-4]$|[1-4]/', org))


def is_foreign_student_course(course: dict) -> bool:
    """가천리버럴아츠칼리지의 한국어 강의 = 외국인 유학생용"""
    course_name = course.get("course_name", "") or ""
    organization = course.get("organization", "") or ""
    return (
        "한국어" in course_name 
        and "가천리버럴아츠칼리지" in organization
    )


# ==========================================================
# 1단계: 후보 강의 필터링
# ==========================================================

def filter_candidates(all_courses: list, request: CSPRequest) -> list:
    """
    수강 가능한 강의만 후보로 추리기.
    - 기수강 제외
    - 외국인 유학생용 한국어 강의 제외
    - 학년 매칭
    - 학과 매칭 또는 교양
    """
    taken_codes = set(request.taken_course_codes)
    candidates = []

    cart_ids = set(request.cart_course_ids)

    for c in all_courses:
        if c["course_code"] in taken_codes:
            continue
        if len(c["schedules"]) == 0:
            continue
        if is_foreign_student_course(c):
            continue

        # 장바구니 강의는 필터 없이 무조건 포함
        if c["course_id"] in cart_ids:
            candidates.append(c)
            continue

        grade_ok = (not c["grades"] or request.grade in c["grades"])

        is_major = (request.major_id in c["major_ids"]) and grade_ok

        # 특정 학과 계교는 그 학과 학생만
        if is_specific_major_liberal(c):
            is_liberal = (request.major_id in c["major_ids"]) and grade_ok
        else:
            is_liberal = (c["classification"] in LIBERAL_ARTS_CLASSIFICATIONS) and grade_ok

        if is_major or is_liberal:
            candidates.append(c)

    print(f"[DEBUG] 후보 강의 수: {len(candidates)}")
    print(f"[DEBUG] 전공: {sum(1 for c in candidates if request.major_id in c['major_ids'])}")
    print(f"[DEBUG] 교양: {sum(1 for c in candidates if c['classification'] in LIBERAL_ARTS_CLASSIFICATIONS)}")
    print(f"[DEBUG] 학점 합계 가능: {sum(c['credits'] for c in candidates)}")

    return candidates


# ==========================================================
# 2단계: 기본 제약 추가 (모든 plan 공통)
# ==========================================================

def build_base_model(
    candidates: list, 
    request: CSPRequest, 
    distance_map: dict
) -> tuple[cp_model.CpModel, dict]:
    """
    모든 plan에 공통인 hard constraint를 추가한 모델 반환.
    
    Returns:
        (model, variables): CP-SAT 모델과 강의별 BoolVar 딕셔너리
    """
    model = cp_model.CpModel()

    # 변수 생성: 각 강의를 시간표에 넣을지(1) 말지(0)
    variables = {}
    for course in candidates:
        cid = course["course_id"]
        variables[cid] = model.NewBoolVar(f"course_{cid}")

    # 제약 1: 시간 충돌 방지
    _add_time_conflict_constraint(model, variables, candidates)

    # 제약 2: 장바구니 고정
    _add_cart_constraint(model, variables, request)

    # 제약 3: 학점 범위
    _add_credit_range_constraint(model, variables, candidates, request)

    # 제약 4: 같은 과목 분반 중복 방지
    _add_section_duplicate_constraint(model, variables, candidates)

    # 제약 5: 이동시간 10분 초과 차단
    _add_travel_time_constraint(model, variables, candidates, distance_map)

    # 제약 6: 온라인 강의 수 제어
    if not request.prefer_online:
        # 강의실 선호 → 온라인 강의 완전 제외
        for course in candidates:
            if all(s.get("building_id") is None for s in course["schedules"]):
                model.Add(variables[course["course_id"]] == 0)
    elif request.min_online_count > 0:
        _add_min_online_constraint(model, variables, candidates, request.min_online_count)

    return model, variables


def _add_time_conflict_constraint(model, variables, candidates):
    """타임슬롯별로 최대 1개 강의만 선택 가능"""
    timeslot_courses = {}
    for course in candidates:
        cid = course["course_id"]
        for sched in course["schedules"]:
            day = sched["day_of_week"]
            for period in range(sched["start_period"], sched["end_period"] + 1):
                slot = (day, period)
                timeslot_courses.setdefault(slot, []).append(cid)

    for slot, course_ids in timeslot_courses.items():
        if len(course_ids) > 1:
            model.Add(sum(variables[cid] for cid in course_ids) <= 1)


def _add_cart_constraint(model, variables, request):
    """장바구니 강의는 반드시 선택"""
    cart_ids = set(request.cart_course_ids)
    for cid in cart_ids:
        if cid in variables:
            model.Add(variables[cid] == 1)


def _add_credit_range_constraint(model, variables, candidates, request):
    """학점 범위 제약"""
    if request.credit_intensity == "RELAXED":
        min_credits, max_credits = 12, 16
    elif request.credit_intensity == "INTENSIVE":
        min_credits, max_credits = 19, 23
    else:  # NORMAL
        min_credits, max_credits = 15, 21

    total_credits = sum(
        course["credits"] * variables[course["course_id"]]
        for course in candidates
    )
    model.Add(total_credits >= min_credits)
    model.Add(total_credits <= max_credits)


def _add_section_duplicate_constraint(model, variables, candidates):
    """같은 과목명(괄호 내용 제거)은 최대 1개 분반만 선택"""
    name_groups = {}
    for course in candidates:
        clean_name = re.sub(r"\s*\(.*?\)", "", course["course_name"]).strip()
        name_groups.setdefault(clean_name, []).append(course["course_id"])

    for name, cids in name_groups.items():
        if len(cids) > 1:
            model.Add(sum(variables[cid] for cid in cids) <= 1)


def _add_min_online_constraint(model, variables, candidates, min_count):
    """온라인 강의 최소 개수 하드 제약"""
    online_vars = [
        variables[c["course_id"]] for c in candidates
        if all(s.get("building_id") is None for s in c["schedules"])
    ]
    if online_vars:
        model.Add(sum(online_vars) >= min_count)


def _add_travel_time_constraint(model, variables, candidates, distance_map):
    """연속 교시 강의 간 이동시간 10분 초과면 동시 선택 금지"""
    for pair in _iter_consecutive_pairs(candidates):
        course_a, course_b, sched_a, sched_b = pair
        bid_a = sched_a.get("building_id")
        bid_b = sched_b.get("building_id")

        if bid_a is None or bid_b is None or bid_a == bid_b:
            continue

        # A 끝 → B 시작 방향
        if sched_a["end_period"] + 1 == sched_b["start_period"]:
            dist = distance_map.get((bid_a, bid_b))
        else:
            dist = distance_map.get((bid_b, bid_a))

        if dist and dist["time_minutes"] > 10:
            model.Add(
                variables[course_a["course_id"]] +
                variables[course_b["course_id"]] <= 1
            )


def _iter_consecutive_pairs(candidates):
    """연속 교시 강의 페어를 (course_a, course_b, sched_a, sched_b)로 순회"""
    for course_a in candidates:
        for course_b in candidates:
            if course_a["course_id"] >= course_b["course_id"]:
                continue
            for sched_a in course_a["schedules"]:
                for sched_b in course_b["schedules"]:
                    if sched_a["day_of_week"] != sched_b["day_of_week"]:
                        continue
                    is_consecutive = (
                        sched_a["end_period"] + 1 == sched_b["start_period"] or
                        sched_b["end_period"] + 1 == sched_a["start_period"]
                    )
                    if is_consecutive:
                        yield course_a, course_b, sched_a, sched_b


# ==========================================================
# 3단계: 목적함수 (사용자 우선순위 반영)
# ==========================================================

def build_objective(
    model: cp_model.CpModel,
    variables: dict,
    candidates: list,
    distance_map: dict,
    request: CSPRequest,
    weights: dict,
) -> None:
    """가중치 받아서 목적함수 설정 (Plan별로 다른 가중치 가능)"""
    objective_terms = []

    # 공강 요일 페널티
    free_day_w = weights.get("FREE_DAY", 1)
    if request.free_days:
        for course in candidates:
            cid = course["course_id"]
            for sched in course["schedules"]:
                if sched["day_of_week"] in request.free_days:
                    objective_terms.append(-free_day_w * 10 * variables[cid])

    # 오르막 회피 페널티
    uphill_w = weights.get("AVOID_UPHILL", 1)
    if request.avoid_uphill:
        _add_uphill_penalty(model, variables, candidates, distance_map, uphill_w, objective_terms)

    # 온라인 강의 선호 보너스 (min_online_count까지만 보상, 초과분은 추가 보상 없음)
    online_w = weights.get("PREFER_ONLINE", 1)
    if request.prefer_online:
        threshold = max(request.min_online_count, 1)
        online_courses = [
            c for c in candidates
            if all(s.get("building_id") is None for s in c["schedules"])
        ]
        if online_courses:
            online_count_var = model.NewIntVar(0, len(online_courses), "online_count")
            model.Add(online_count_var == sum(variables[c["course_id"]] for c in online_courses))
            # threshold까지만 보상 (capped): 그 이상 온라인을 택해도 추가 점수 없음
            capped = model.NewIntVar(0, threshold, "online_capped")
            threshold_const = model.NewIntVar(threshold, threshold, "online_threshold")
            model.AddMinEquality(capped, [online_count_var, threshold_const])
            objective_terms.append(online_w * 10 * capped)

    # 오전/오후 선호 보너스
    morning_w = weights.get("PREFER_MORNING", 1)
    for course in candidates:
        cid = course["course_id"]
        for sched in course["schedules"]:
            is_morning = sched["start_period"] <= 4
            if request.preferred_time == "MORNING" and is_morning:
                objective_terms.append(morning_w * 2 * variables[cid])
            elif request.preferred_time == "AFTERNOON" and not is_morning:
                objective_terms.append(morning_w * 2 * variables[cid])

    # 교육과정 일치 보너스
    curriculum = get_curriculum_courses(
        request.apply_year, request.major_name, request.grade, request.semester
    )
    if curriculum:
        for course in candidates:
            cid = course["course_id"]
            normalized = re.sub(r"\s*\(.*?\)", "", course["course_name"]).strip()
            if normalized in curriculum.get("전필", []):
                objective_terms.append(30 * variables[cid])
            elif normalized in curriculum.get("전선", []) or normalized in curriculum.get("계교", []):
                objective_terms.append(10 * variables[cid])

    # 학점 최대화 (기본 보너스, 모든 plan 공통)
    for course in candidates:
        cid = course["course_id"]
        objective_terms.append(course["credits"] * variables[cid])

    if objective_terms:
        model.Maximize(sum(objective_terms))


def _add_uphill_penalty(model, variables, candidates, distance_map, weight, objective_terms):
    """오르막 이동이 발생하는 연속 교시 페어에 페널티"""
    for pair in _iter_consecutive_pairs(candidates):
        course_a, course_b, sched_a, sched_b = pair
        bid_a = sched_a.get("building_id")
        bid_b = sched_b.get("building_id")

        if bid_a is None or bid_b is None or bid_a == bid_b:
            continue

        if sched_a["end_period"] + 1 == sched_b["start_period"]:
            dist = distance_map.get((bid_a, bid_b))
        else:
            dist = distance_map.get((bid_b, bid_a))

        if dist and dist["is_uphill"]:
            both = model.NewBoolVar(
                f"uphill_{course_a['course_id']}_{course_b['course_id']}"
            )
            model.AddBoolAnd([
                variables[course_a["course_id"]],
                variables[course_b["course_id"]]
            ]).OnlyEnforceIf(both)
            model.AddBoolOr([
                variables[course_a["course_id"]].Not(),
                variables[course_b["course_id"]].Not()
            ]).OnlyEnforceIf(both.Not())

            objective_terms.append(-weight * 5 * both)


# ==========================================================
# 4단계: 솔버 실행 + 다중 해 수집
# ==========================================================

class TimetableCallback(cp_model.CpSolverSolutionCallback):
    """솔버가 해를 찾을 때마다 호출되는 콜백"""

    def __init__(self, variables, course_list, max_solutions=50):
        cp_model.CpSolverSolutionCallback.__init__(self)
        self._variables = variables
        self._course_list = course_list
        self._solutions = []
        self._max_solutions = max_solutions
        self._count = 0

    def on_solution_callback(self):
        self._count += 1
        selected = [
            course for course in self._course_list
            if self.Value(self._variables[course["course_id"]])
        ]
        score = self.ObjectiveValue()
        self._solutions.append({
            "selected_courses": selected,
            "score": score,
        })
        if self._count >= self._max_solutions:
            self.StopSearch()

    def get_solutions(self):
        return self._solutions


def run_solver(model, variables, candidates) -> list[dict]:
    """솔버 실행 후 찾은 해 리스트 반환"""
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10.0
    solver.parameters.enumerate_all_solutions = True

    callback = TimetableCallback(variables, candidates, max_solutions=50)
    status = solver.Solve(model, callback)

    return callback.get_solutions(), status

def solve_single_plan(
    candidates: list,
    request: CSPRequest,
    distance_map: dict,
    weights: dict,
) -> dict | None:
    """
    가중치 1세트로 1개 해를 풀어 반환.
    
    Returns:
        {"selected_courses": [...], "score": 42} 또는 None
    """
    model, variables = build_base_model(candidates, request, distance_map)
    build_objective(model, variables, candidates, distance_map, request, weights)

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10.0
    # 단일 해만 필요하므로 enumerate 비활성화 → 빠름
    
    status = solver.Solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return None

    selected = [
        course for course in candidates
        if solver.Value(variables[course["course_id"]])
    ]
    return {
        "selected_courses": selected,
        "score": solver.ObjectiveValue(),
    }

# ==========================================================
# 5단계: 메인 함수
# ==========================================================

def solve_timetable(request: CSPRequest) -> CSPResponse:
    """
    시간표 최적화 메인 함수.
    
    1) 데이터 로드
    2) 후보 강의 필터링
    3) Plan A/B/C 가중치 프로파일 생성
    4) 각 Plan별로 솔버 실행
    5) 응답 변환
    """
    # 1) 데이터 로드
    all_courses = load_courses()
    distance_map = load_distances()

    # 2) 후보 필터링
    candidates = filter_candidates(all_courses, request)

    # 장바구니 검증
    cart_ids = set(request.cart_course_ids)
    candidate_ids = {c["course_id"] for c in candidates}
    missing_cart = cart_ids - candidate_ids
    if missing_cart:
        return CSPResponse(
            result_code="NO_SOLUTION",
            found_count=0,
            conflict_info=[ConflictInfo(
                conflict_type="MISSING_CART_COURSE",
                message=f"장바구니 강의 ID {missing_cart}가 후보에 없습니다.",
                suggestion="기수강 과목과 겹치거나 존재하지 않는 강의를 확인해주세요."
            )]
        )

    # 3) Plan profile 생성
    profiles = get_plan_profiles(request)

    # 4) Plan A/B/C 각각 풀이
    plans = []
    seen_keys = set()
    
    for plan_type in ["A", "B", "C"]:
        profile = profiles[plan_type]
        solution = solve_single_plan(
            candidates, request, distance_map, profile["weights"]
        )
        
        if solution is None:
            print(f"[DEBUG] Plan {plan_type}: 해 없음")
            continue
        
        # 같은 강의 조합이면 스킵 (다양성 확보)
        key = frozenset(c["course_id"] for c in solution["selected_courses"])
        if key in seen_keys:
            print(f"[DEBUG] Plan {plan_type}: 이전 plan과 동일 → 스킵")
            continue
        seen_keys.add(key)
        
        plans.append(_build_plan(solution, plan_type, profile["label"]))
        print(f"[DEBUG] Plan {plan_type} ({profile['label']}): score={int(solution['score'])}")

    # 5) 결과 처리
    if not plans:
        return CSPResponse(
            result_code="NO_SOLUTION",
            found_count=0,
            conflict_info=[ConflictInfo(
                conflict_type="INFEASIBLE",
                message="주어진 조건을 모두 만족하는 시간표를 찾을 수 없습니다.",
                suggestion="장바구니 강의 시간이 겹치는지 확인하거나, 학점 범위를 조정해보세요."
            )]
        )

    result_code = "SUCCESS" if len(plans) == 3 else "PARTIAL"

    # plan_type 기준으로 매핑 (스킵된 plan은 None)
    plan_dict = {p.plan_type: p for p in plans}

    return CSPResponse(
        result_code=result_code,
        found_count=len(plans),
        plan_a=plan_dict.get("A"),
        plan_b=plan_dict.get("B"),
        plan_c=plan_dict.get("C"),
        conflict_info=[],
    )

# ==========================================================
# 응답 변환 헬퍼
# ==========================================================

def _deduplicate_solutions(solutions: list) -> list:
    """동일한 강의 조합의 해를 제거"""
    seen = set()
    unique = []
    for sol in solutions:
        key = frozenset(c["course_id"] for c in sol["selected_courses"])
        if key not in seen:
            seen.add(key)
            unique.append(sol)
    return unique


def _build_plan(solution: dict, plan_type: str, plan_label: str) -> TimetablePlan:
    """솔루션을 TimetablePlan 스키마로 변환"""
    courses = solution["selected_courses"]
    score = int(abs(solution["score"]))
    total_credits = sum(c["credits"] for c in courses)
    characteristics = _generate_characteristics(courses)

    schedules = []
    for course in courses:
        for sched in course["schedules"]:
            schedules.append(ScheduleItem(
                course_id=course["course_id"],
                course_code=course["course_code"],
                course_name=course["course_name"],
                professor=course.get("professor"),
                credits=course["credits"],
                classification=course["classification"],
                day_of_week=sched["day_of_week"],
                start_period=sched["start_period"],
                end_period=sched["end_period"],
                building_name=sched.get("building_name"),
                room_name=sched.get("room_name"),
            ))

    return TimetablePlan(
        plan_type=plan_type,
        plan_label=plan_label,
        optimization_score=score,
        characteristics=characteristics,
        total_credits=total_credits,
        schedules=schedules,
    )


def _generate_characteristics(courses: list) -> list[str]:
    """선택된 강의들의 특징 태그 생성"""
    tags = []

    # 공강 요일
    day_count = {}
    for course in courses:
        for sched in course["schedules"]:
            day = sched["day_of_week"]
            day_count[day] = day_count.get(day, 0) + 1
    
    all_days = {"월", "화", "수", "목", "금"}
    free_days = all_days - set(day_count.keys())
    for day in free_days:
        tags.append(f"#공강{day}요일")

    # 오전/오후 비율
    morning = sum(
        1 for c in courses for s in c["schedules"] if s["start_period"] <= 4
    )
    afternoon = sum(
        1 for c in courses for s in c["schedules"] if s["start_period"] > 4
    )
    if morning > afternoon * 2:
        tags.append("#오전집중형")
    elif afternoon > morning * 2:
        tags.append("#오후집중형")

    # 온라인 강의
    online_count = sum(
        1 for c in courses
        if all(s.get("building_id") is None for s in c["schedules"])
    )
    if online_count >= 2:
        tags.append("#온라인강의다수")

    # 학점
    total = sum(c["credits"] for c in courses)
    if total >= 19:
        tags.append("#고학점")
    elif total <= 14:
        tags.append("#여유로운학기")

    return tags if tags else ["#균형잡힌시간표"]