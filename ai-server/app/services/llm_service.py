"""
LLM 코멘트 생성 서비스
=====================
OpenAI GPT-4o-mini를 사용하여 시간표에 대한
AI 코멘트를 생성.
"""

import os
from openai import OpenAI
from dotenv import load_dotenv
from app.schemas.llm_schema import LLMRequest, LLMResponse

# .env 파일 경로 명시적 지정
import pathlib

ENV_PATH = pathlib.Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(ENV_PATH)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ==========================================================
# System Prompt
# ==========================================================

SYSTEM_PROMPT = """당신은 가천대학교 학생들의 시간표를 분석해주는 AI 학사 어드바이저입니다.

역할:
- 생성된 시간표의 특징을 분석하고 맞춤형 코멘트 제공
- 포함된 강의명을 구체적으로 언급하며 분석
- 학년에 맞는 실질적 조언 (3학년이면 취업/포트폴리오, 4학년이면 졸업요건)

톤:
- 존댓말 사용 (예: "~입니다", "~하세요", "~드려요")
- 전문적이지만 따뜻한 톤
- 이모지 1~2개 적절히 사용

Plan별 분석 관점:
- Plan A: 효율성과 최적화 관점에서 분석. "이 시간표가 가장 추천되는 이유"를 설명.
- Plan B: Plan A와의 차이점 중심. "이런 분이라면 Plan B가 더 맞을 수 있다"는 대안 제시.
- Plan C: 생활 패턴과 균형 관점. 전공/교양 비율, 시간 여유, 자기계발 시간 등 분석.

형식:
- 3~5문장으로 간결하게
- 첫 문장에서 이 Plan의 핵심 특징을 한마디로 요약
- 마지막 문장은 실질적 조언으로 마무리
"""


def _build_user_message(request: LLMRequest) -> str:
    """LLMRequest → GPT에 보낼 사용자 메시지 변환"""
    courses_str = ", ".join(request.course_names)
    chars_str = ", ".join(request.characteristics)
    
    return f"""다음 시간표를 분석해줘.

학과: {request.major_name}
학년: {request.grade}학년
플랜: Plan {request.plan_type}
총 학점: {request.total_credits}학점
특징 태그: {chars_str}
포함 강의: {courses_str}

이 시간표에 대해 3~5문장으로 간단히 코멘트해줘."""


def generate_ai_comment(request: LLMRequest) -> LLMResponse:
    """GPT-4o-mini로 시간표 코멘트 생성"""
    try:
        # System Prompt: 사용자가 커스텀 제공하면 그걸 쓰고, 아니면 기본값
        system = request.system_prompt if request.system_prompt else SYSTEM_PROMPT
        
        user_message = _build_user_message(request)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_message},
            ],
            max_tokens=300,
            temperature=0.7,
            timeout=10,
        )
        
        comment = response.choices[0].message.content.strip()
        
        return LLMResponse(
            result_code="SUCCESS",
            comment=comment,
            model_used="gpt-4o-mini",
        )
    
    except Exception as e:
        print(f"[LLM ERROR] {type(e).__name__}: {e}")
        fallback_comments = {
            "A": "이 시간표는 최적화 점수가 가장 높은 추천안입니다. 균형 잡힌 구성으로 효율적인 학기를 보내실 수 있습니다.",
            "B": "이 시간표는 두 번째 추천안입니다. Plan A와 다른 시간대 배치로 새로운 선택이 될 수 있습니다.",
            "C": "이 시간표는 균형형 구성입니다. 다양한 시간표를 비교해보시고 자신에게 맞는 것을 선택해보세요.",
        }
        return LLMResponse(
            result_code="FALLBACK",
            comment=fallback_comments.get(
                request.plan_type,
                "시간표가 생성되었습니다. 자세한 내용을 확인해보세요."
            ),
            model_used=None,
        )