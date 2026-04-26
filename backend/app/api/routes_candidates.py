from fastapi import APIRouter, HTTPException
from app.services.candidate_store import CandidateStore
from app.agents.matcher import MatcherAgent
from app.agents.jd_parser import JDParserAgent
from app.agents.interest_agent import InterestAgent
from pydantic import BaseModel

router = APIRouter()
store = CandidateStore()

class JDRequest(BaseModel):
    jd_text: str

@router.post("/match")
def match_candidates(payload: JDRequest):
    jd = JDParserAgent.parse(payload.jd_text)

    if not jd.is_valid:
        raise HTTPException(
            status_code=400, 
            detail=jd.friendly_message or "This text doesn't look like a valid Job Description."
        )

    candidates = store.get_all()
    if not candidates:
        return {"matches": [], "message": "No candidates in database.", "mode": "empty"}

    raw_results = []
    for c in candidates:
        match = MatcherAgent.match(jd, c)
        raw_results.append({**match, "candidate_obj": c})

    raw_results.sort(key=lambda x: x["final_score"], reverse=True)

    final_results = []
    
    for i, res in enumerate(raw_results):
        c = res.pop("candidate_obj")
        
        if i < 3 and res["final_score"] >= 0.5:
            ai_insight = InterestAgent.generate_insight(c, jd, res["matched_skills"], res["missing_skills"])
            questions = InterestAgent.generate_questions(c, res["matched_skills"], res["missing_skills"])
    
            interest_score = ai_insight.get("interest_score", 0.0)
            ai_summary = ai_insight.get("pitch", "")
        else:
            interest_score = 0.0
            ai_summary = "Technical match analyzed."
            questions = []

        final_results.append({
            **res,
            "interest_score": interest_score,
            "ai_summary": ai_summary,
            "interview_questions": questions
})

    final_results.sort(key=lambda x: (x["final_score"], x["interest_score"]), reverse=True)
    
    max_tech_score = max([r["final_score"] for r in final_results]) if final_results else 0
    no_skill_matches = all(r["skill_score"] == 0 for r in final_results)

    if max_tech_score < 0.3 or no_skill_matches:
        fallback = sorted(final_results, key=lambda x: x["semantic_score"], reverse=True)[:5]
        return {
            "parsed_jd": jd.dict(),
            "matches": fallback,
            "message": "⚠️ Low technical alignment. Showing strongest semantic profiles.",
            "mode": "fallback_semantic"
        }

    return {
        "parsed_jd": jd.dict(),
        "matches": final_results[:5],
        "mode": "normal"
    }
