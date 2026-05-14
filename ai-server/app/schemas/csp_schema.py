"""
CSP 최적화 요청/응답 스키마
==========================
백엔드 Web Server가 보내는 요청 형식과
AI Server가 돌려주는 응답 형식을 정의.
"""

from pydantic import BaseModel
 
 
class CSPRequest(BaseModel):
    """시간표 최적화 요청"""
 
    user_id: int
    major_id: int
    grade: int
    apply_year: str
 
    # 장바구니 고정 강의
    cart_course_ids: list[int] = []
 
    # 기수강 과목 (중복 수강 방지)
    taken_course_codes: list[str] = []
 
    # 사용자 우선순위 (드래그앤드롭 순서)
    # ["FREE_DAY", "AVOID_UPHILL", "PREFER_ONLINE", "PREFER_MORNING"]
    # 첫번째가 가중치 가장 높음
    priority_order: list[str] = []
 
    # 사용자 선호도
    preferred_time: str = "ANY"           # MORNING / AFTERNOON / ANY
    free_days: list[str] = []             # 공강 원하는 요일 ["금"]
    credit_intensity: str = "NORMAL"      # RELAXED / NORMAL / INTENSIVE
    avoid_uphill: bool = False
    prefer_online: bool = False
    min_online_count: int = 0   # 온라인 강의 최소 개수 (1 또는 2)
 
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "major_id": 62,
                "grade": 3,
                "apply_year": "23",
                "cart_course_ids": [101, 205, 310],
                "taken_course_codes": ["15290001", "15290002"],
                "priority_order": ["FREE_DAY", "AVOID_UPHILL", "PREFER_ONLINE", "PREFER_MORNING"],
                "preferred_time": "MORNING",
                "free_days": ["금"],
                "credit_intensity": "NORMAL",
                "avoid_uphill": True,
                "prefer_online": False,
            }
        }
 
 
class ScheduleItem(BaseModel):
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
    plan_type: str             # "A" / "B" / "C"
    plan_label: str            # "공강 요일 우선" 등
    optimization_score: int
    characteristics: list[str]
    total_credits: int
    schedules: list[ScheduleItem]
 
 
class ConflictInfo(BaseModel):
    conflict_type: str
    message: str
    suggestion: str
 
 
class CSPResponse(BaseModel):
    result_code: str
    found_count: int
    plan_a: TimetablePlan | None = None
    plan_b: TimetablePlan | None = None
    plan_c: TimetablePlan | None = None
    conflict_info: list[ConflictInfo] = []