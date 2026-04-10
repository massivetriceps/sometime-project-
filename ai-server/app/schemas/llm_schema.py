"""
LLM 코멘트 요청/응답 스키마
===========================
시간표 결과를 받아서 AI 코멘트를 생성하는 API의 형식 정의.
"""

from pydantic import BaseModel


class LLMRequest(BaseModel):
    """AI 코멘트 생성 요청"""

    user_id: int
    major_name: str                       # 학과명
    grade: int                            # 학년
    plan_type: str                        # "A", "B", "C"
    optimization_score: int               # 최적화 점수
    total_credits: int                    # 총 학점
    characteristics: list[str]            # 특징 태그
    course_names: list[str]               # 포함된 강의명 목록
    system_prompt: str | None = None      # 백엔드에서 조합한 시스템 프롬프트

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "major_name": "컴퓨터공학과",
                "grade": 3,
                "plan_type": "A",
                "optimization_score": 92,
                "total_credits": 18,
                "characteristics": ["#아침시간활용", "#공강금요일"],
                "course_names": ["자료구조", "알고리즘", "운영체제"],
                "system_prompt": None,
            }
        }


class LLMResponse(BaseModel):
    """AI 코멘트 응답"""

    result_code: str                      # SUCCESS / FALLBACK / ERROR
    comment: str                          # AI 생성 코멘트
    model_used: str | None = None         # 사용된 모델명

    class Config:
        json_schema_extra = {
            "example": {
                "result_code": "SUCCESS",
                "comment": "이 시간표는 오전 수업 위주로 구성되어 있어 오후 시간을 자유롭게 활용할 수 있어요!",
                "model_used": "claude-3-5-sonnet",
            }
        }
