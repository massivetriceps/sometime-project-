"""
LLM 코멘트 라우터
=================
POST /api/ai/llm/comment
→ 11주차부터 실제 LLM API 연동 예정
→ 지금은 기본 코멘트(fallback) 반환
"""

from fastapi import APIRouter
from app.schemas.llm_schema import LLMRequest, LLMResponse

router = APIRouter(
    prefix="/api/ai/llm",
    tags=["LLM AI 코멘트"],
)


# 기본 코멘트 템플릿 (LLM 연동 전 fallback)
FALLBACK_COMMENTS = {
    "A": "이 시간표는 최적화 점수가 가장 높은 추천 시간표입니다. 균형 잡힌 구성으로 효율적인 학기를 보낼 수 있어요!",
    "B": "이 시간표는 두 번째 추천안입니다. Plan A와는 다른 시간대 배치로 색다른 선택이 될 수 있어요.",
    "C": "이 시간표는 세 번째 대안입니다. 다양한 시간표를 비교해보고 자신에게 맞는 것을 골라보세요!",
}


@router.post("/comment", response_model=LLMResponse)
def generate_comment(request: LLMRequest):
    """
    AI 코멘트 생성 API

    시간표 결과 정보를 받아서 맞춤형 코멘트를 생성.

    [현재 상태: fallback 코멘트]
    - 11주차: LLM API 연동
    - 12주차: System Prompt 고도화 + 에러 핸들링
    """

    # ============================================
    # TODO: 여기에 LLM API 호출 로직 구현 (11주차~)
    # from app.services.llm_service import generate_ai_comment
    # result = generate_ai_comment(request)
    # return result
    # ============================================

    # Fallback 코멘트 반환
    comment = FALLBACK_COMMENTS.get(
        request.plan_type,
        "시간표가 생성되었습니다. 자세한 내용을 확인해보세요!"
    )

    return LLMResponse(
        result_code="FALLBACK",
        comment=comment,
        model_used=None,
    )
