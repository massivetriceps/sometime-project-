"""
CSP 최적화 요청/응답 스키마
==========================
백엔드 Web Server가 보내는 요청 형식과
AI Server가 돌려주는 응답 형식을 정의.
"""

from pydantic import BaseModel


# ----------------------------------------------------------
# 요청 (Request): 백엔드 → AI 서버
# ----------------------------------------------------------

class CSPRequest(BaseModel):
    """시간표 최적화 요청"""

    user_id: int                          # 사용자 ID
    major_id: int                         # 학과 ID
    grade: int                            # 학년
    apply_year: str                       # 적용학번 (예: "23")

    # 장바구니에 담은 강의 ID 목록 (고정 과목)
    cart_course_ids: list[int] = []

    # 기수강 과목 코드 목록 (중복 수강 방지)
    taken_course_codes: list[str] = []

    # 사용자 선호도
    preferred_time: str = "ANY"             # MORNING / AFTERNOON / EVENING / ANY
    free_days: list[str] = []               # 공강 원하는 요일 ["MON", "FRI"]
    credit_intensity: str = "NORMAL"        # RELAXED / NORMAL / INTENSIVE
    minimize_gaps: bool = False             # 공강 최소화
    prioritize_required: bool = False       # 필수과목 우선
    max_classes_per_day: int | None = None  # 하루 최대 강의 수
    avoid_uphill: bool = False              # 오르막 기피
    prefer_online: bool = False             # 온라인 선호

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "major_id": 62,
                "grade": 3,
                "apply_year": "23",
                "cart_course_ids": [101, 205, 310],
                "taken_course_codes": ["15290001", "15290002"],
                "preferred_time": "MORNING",
                "free_days": ["FRI"],
                "credit_intensity": "NORMAL",
                "minimize_gaps": True,
                "prioritize_required": True,
                "max_classes_per_day": 4,
                "avoid_uphill": True,
                "prefer_online": False,
            }
        }


# ----------------------------------------------------------
# 응답 (Response): AI 서버 → 백엔드
# ----------------------------------------------------------

class ScheduleItem(BaseModel):
    """시간표 안에 포함된 개별 강의"""
    course_id: int
    course_code: str
    course_name: str
    professor: str | None
    credits: int
    classification: str
    day_of_week: str
    start_period: int
    end_period: int
    building_name: str | None
    room_name: str | None


class TimetablePlan(BaseModel):
    """최적화된 시간표 1개 (Plan A, B, C 중 하나)"""
    plan_type: str                        # "A", "B", "C"
    optimization_score: int               # 최적화 점수 (높을수록 좋음)
    characteristics: list[str]            # 특징 태그 ["#아침시간활용", "#공강금요일"]
    total_credits: int                    # 총 학점
    schedules: list[ScheduleItem]         # 강의 목록


class ConflictInfo(BaseModel):
    """제약 충돌 정보 (해를 못 찾았을 때)"""
    conflict_type: str                    # 충돌 유형
    message: str                          # 설명
    suggestion: str                       # 해결 제안


class CSPResponse(BaseModel):
    """시간표 최적화 응답"""
    result_code: str                      # SUCCESS / PARTIAL / NO_SOLUTION
    found_count: int                      # 찾은 해 개수 (0~3)
    plan_a: TimetablePlan | None = None
    plan_b: TimetablePlan | None = None
    plan_c: TimetablePlan | None = None
    conflict_info: list[ConflictInfo] = []

    class Config:
        json_schema_extra = {
            "example": {
                "result_code": "SUCCESS",
                "found_count": 3,
                "plan_a": {
                    "plan_type": "A",
                    "optimization_score": 92,
                    "characteristics": ["#아침시간활용", "#공강금요일"],
                    "total_credits": 18,
                    "schedules": [],
                },
                "plan_b": None,
                "plan_c": None,
                "conflict_info": [],
            }
        }
