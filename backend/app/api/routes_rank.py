from fastapi import APIRouter
from app.agents.ranking_agent import RankingAgent
from pydantic import BaseModel
from typing import List

router = APIRouter()

# 🛡️ Define the structure for incoming candidates
class CandidateScoreInput(BaseModel):
    candidate_id: str
    name: str
    final_score: float  # Mapping the Matcher's technical score
    interest_score: float

class ShortlistRequest(BaseModel):
    candidates: List[CandidateScoreInput]

@router.post("/shortlist")
def generate_shortlist(payload: ShortlistRequest):
    """
    Final decision route. 
    Expects technical 'final_score' and behavioral 'interest_score'.
    """
    # Convert Pydantic list to dicts for the Agent
    candidate_dicts = [c.dict() for c in payload.candidates]
    
    ranked = RankingAgent.rank_candidates(candidate_dicts)

    return {
        "shortlist": ranked,
        "count": len(ranked)
    }