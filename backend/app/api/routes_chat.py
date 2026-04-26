from fastapi import APIRouter, HTTPException
from app.agents.interest_agent import InterestAgent
from pydantic import BaseModel
import json
import re

router = APIRouter()

class EvaluationRequest(BaseModel):
    candidate_name: str
    role: str
    conversation: str

def clean_llm_json(raw_text: str) -> dict:
    """
    Extracts and parses JSON from LLM responses, 
    handling markdown blocks and stray text.
    """
    try:
        json_match = re.search(r"```json\s*(\{.*?\})\s*```", raw_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        
        json_match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
            
        return json.loads(raw_text)
    except Exception:
        raise ValueError("Neural Link Failure: Response format invalid.")

@router.post("/evaluate")
def evaluate_interest(payload: EvaluationRequest):
    """
    Analyzes conversation strings to extract behavioral intent 
    and compute a normalized interest score.
    """
    try:
        raw_response = InterestAgent.evaluate_response(payload.conversation)
        
        data = clean_llm_json(raw_response)
        
        analysis = data.get("analysis", {})

        score = InterestAgent.compute_interest_score(analysis)

        return {
            "interest_score": round(score, 3),
            "analysis": analysis,
            "summary": data.get("summary", "ANALYSIS_COMPLETE: System stabilized.")
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"UPLINK_DEGRADED: {str(e)}"
        )
