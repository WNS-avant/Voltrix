from pydantic import BaseModel


class MatchScore(BaseModel):
    skill_score: float
    experience_score: float
    embedding_score: float
    final_score: float


class InterestScore(BaseModel):
    enthusiasm: float
    availability: float
    salary_fit: float
    final_score: float