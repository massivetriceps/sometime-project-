"""
CSP 최적화 라우터
================
POST /api/ai/csp/optimize
-> OR-Tools CSP 솔버 연결
"""

from fastapi import APIRouter
from app.schemas.csp_schema import CSPRequest, CSPResponse
from app.services.csp_service import solve_timetable
 
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
 
    기본 제약 조건:
      - 시간 충돌 방지
      - 기수강 과목 제외
      - 장바구니 고정
      - 학점 범위 제약
      - 같은 과목 분반 중복 방지
      - 이동시간 10분 초과 차단
 
    사용자 우선순위 (priority_order로 가중치 조절):
      - FREE_DAY: 공강 요일
      - AVOID_UPHILL: 오르막 회피
      - PREFER_ONLINE: 온라인 강의 선호
      - PREFER_MORNING: 오전 수업 선호
    """
    return solve_timetable(request)