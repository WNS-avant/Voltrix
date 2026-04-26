from fastapi import APIRouter, HTTPException
from app.agents.interest_agent import InterestAgent
from pydantic import BaseModel
import json

router = APIRouter()

class EvaluationRequest(BaseModel):
    candidate_name: str
    role: str
    conversation: str

@router.post("/evaluate")
def evaluate_interest(payload: EvaluationRequest):
    try:
        raw_response = InterestAgent.evaluate_response(payload.conversation)
        
        
        clean_json = raw_response.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_json)
        
       
        analysis = data.get("analysis", {})

        score = InterestAgent.compute_interest_score(analysis)

        return {
            "interest_score": round(score, 3),
            "analysis": analysis,
            "summary": data.get("summary", "Analysis complete.")
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Interest Evaluation Failed: {str(e)}"
        )
