"""
CSP 최적화 라우터
================
POST /api/ai/csp/optimize
→ 7주차부터 OR-Tools 로직을 채워넣을 예정
→ 지금은 더미 응답 반환
"""

from fastapi import APIRouter
from app.schemas.csp_schema import (
    CSPRequest, CSPResponse,
    TimetablePlan, ScheduleItem,
)

router = APIRouter(
    prefix="/api/ai/csp",
    tags=["CSP 시간표 최적화"],
)


@router.post("/optimize", response_model=CSPResponse)
def optimize_timetable(request: CSPRequest):
    """
    시간표 최적화 API

    백엔드에서 학생 정보 + 장바구니 + 선호도를 보내면
    OR-Tools CSP 솔버가 최적 시간표 Plan A/B/C를 반환.

    [현재 상태: 더미 응답]
    - 7주차: 시간 충돌 방지 + 장바구니 고정
    - 8주차: 동선 최적화 + 오르막 회피
    - 9주차: Plan A/B/C 스코어링
    """

    # ============================================
    # TODO: 여기에 OR-Tools CSP 로직 구현 (7주차~)
    # from app.services.csp_service import solve_timetable
    # result = solve_timetable(request)
    # return result
    # ============================================

    # 더미 응답 (백엔드 팀 연동 테스트용)
    dummy_schedule = ScheduleItem(
        course_id=1,
        course_code="15290001",
        course_name="[더미] 자료구조",
        professor="홍길동",
        credits=3,
        classification="전필",
        day_of_week="월",
        start_period=3,
        end_period=4,
        building_name="AI관",
        room_name="AI관-301",
    )

    dummy_plan = TimetablePlan(
        plan_type="A",
        optimization_score=85,
        characteristics=["#더미데이터", "#테스트용"],
        total_credits=3,
        schedules=[dummy_schedule],
    )

    return CSPResponse(
        result_code="SUCCESS",
        found_count=1,
        plan_a=dummy_plan,
        plan_b=None,
        plan_c=None,
        conflict_info=[],
    )
