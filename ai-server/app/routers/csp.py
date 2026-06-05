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
    print(f"[CSP] prefer_online={request.prefer_online}, min_online_count={request.min_online_count}, grade={request.grade}")
    result = solve_timetable(request)
    print(f"[CSP] result_code={result.result_code}, found_count={result.found_count}")
    return result