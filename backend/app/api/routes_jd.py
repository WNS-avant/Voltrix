from fastapi import APIRouter, HTTPException
from app.agents.jd_parser import JDParserAgent
from app.models.jd import JobDescription

router = APIRouter()

@router.post("/parse")
def parse_jd(payload: JobDescription):
    parsed = JDParserAgent.parse(payload.text)

    if not parsed.is_valid:
        raise HTTPException(
            status_code=400, 
            detail=parsed.friendly_message or "Invalid input. Please provide a real Job Description."
        )

    return {
        "parsed_jd": parsed.dict(),
        "status": "success"
    }
