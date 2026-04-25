from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_jd import router as jd_router
from app.api.routes_candidates import router as candidate_router
from app.api.routes_rank import router as rank_router
from app.api.routes_chat import router as chat_router


app = FastAPI(
    title="AI Talent Scouting Agent",
    description="JD → Candidates → Chat → Ranking system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for hackathon, keep it simple
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(jd_router, prefix="/jd", tags=["Job Description"])
app.include_router(candidate_router, prefix="/candidates", tags=["Candidates"])
app.include_router(chat_router, prefix="/chat", tags=["Conversation"])
app.include_router(rank_router, prefix="/rank", tags=["Ranking"])


@app.get("/")
def health_check():
    return {
        "status": "running",
        "message": "AI Talent Scout Agent is alive"
    }