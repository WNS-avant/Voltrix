from fastapi import APIRouter, HTTPException
from app.agents.jd_parser import JDParserAgent
from app.models.jd import JobDescription

router = APIRouter()

@router.post("/parse")
def parse_jd(payload: JobDescription):
    # 1. Run the parser logic
    parsed = JDParserAgent.parse(payload.text)

    # 2. 🔥 Gatekeeper Check
    # We check the flag returned by the Agent. 
    # If the input was jargon, we raise the error NOW.
    if not parsed.is_valid:
        raise HTTPException(
            status_code=400, 
            detail=parsed.friendly_message or "Invalid input. Please provide a real Job Description."
        )

    # 3. If valid, return the data and finish the function
    return {
        "parsed_jd": parsed.dict(),
        "status": "success"
    }