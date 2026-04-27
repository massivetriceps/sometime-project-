"""
가천대 시간표 서비스 - AI Server (FastAPI)
==========================================
실행: uvicorn app.main:app --reload
문서: http://localhost:8000/docs
"""

from fastapi import FastAPI
from app.routers import csp, llm

app = FastAPI(
    title="Sometime AI Server",
    description="LLM 및 CSP 최적화 엔진 기반 시간표 생성 API",
    version="0.1.0",
)

# 라우터 등록
app.include_router(csp.router)
app.include_router(llm.router)


@app.get("/")
def health_check():
    """서버 상태 확인용"""
    return {"status": "ok", "message": "Sometime AI Server 가동 중"}
