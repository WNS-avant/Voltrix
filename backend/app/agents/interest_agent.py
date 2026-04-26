from app.services.llm_client import LLMClient
import json

class InterestAgent:
    SYSTEM_PROMPT = """
    You are an Expert AI Talent Scout & Behavioral Psychologist. 
    Your mission is to evaluate technical fit and behavioral intent.

    RULES:
    - Return ONLY valid JSON.
    - Maintain a tactical, professional, and insightful tone.
    - For behavioral analysis, detect subtle cues in conversation strings.
    """

    @staticmethod
    def evaluate_response(conversation: str):
        """
        NEW: For the ChatPanel. 
        Analyzes raw chat logs for behavioral metrics.
        """
        user_prompt = f"""
        INPUT_DATA: "{conversation}"

        TASK:
        Perform a NEURAL_INTENT_EXTRACTION. Analyze:
        1. Enthusiasm (0.0 - 1.0)
        2. Availability/Urgency (0.0 - 1.0)
        3. Salary/Comp Alignment (0.0 - 1.0)
        
        Return JSON:
        {{
          "analysis": {{
            "enthusiasm": float,
            "availability": float,
            "salary_fit": float
          }},
          "summary": "30-word behavioral summary"
        }}
        """
        return LLMClient.chat(InterestAgent.SYSTEM_PROMPT, user_prompt)

    @staticmethod
    def compute_interest_score(analysis: dict) -> float:
        """
        NEW: Computes a weighted probability from behavioral metrics.
        """
        weights = {"enthusiasm": 0.4, "availability": 0.3, "salary_fit": 0.3}
        score = sum(analysis.get(k, 0.5) * w for k, w in weights.items())
        return score

    @staticmethod
    def generate_insight(candidate, jd, matched, missing):
        """
        Updated: Generates the Pitch and Score for the Candidate Cards.
        """
        user_prompt = f"""
                Role: {jd.role} | Location Required: {jd.location}
                Candidate: {candidate.name} | Current Location: {candidate.location}
                Matched Skills: {', '.join(matched[:5])}
                Gaps: {', '.join(missing[:3]) if missing else 'None'}
                Experience: {candidate.experience} yrs

        TASK:
        1. Evaluate role alignment score (0.0 to 1.0).
        Note: 0.5 yrs equals 6 months. Do not penalize for low numeric value if it matches the JD.
        2. Write a 'Pitch' (35 words max) highlighting the match and addressing the gap.

        Return JSON:
        {{
          "interest_score": float,
          "pitch": "string"
        }}
        """
        raw_response = LLMClient.chat(InterestAgent.SYSTEM_PROMPT, user_prompt)
        try:
            clean_json = raw_response.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_json)
            return {
                "interest_score": round(data.get("interest_score", 0.5), 2),
                "pitch": data.get("pitch", "SOLID_MATCH: Technical alignment confirmed.")
            }
        except:
            return {"interest_score": 0.5, "pitch": "Standard technical profile match."}

    @staticmethod
    def generate_questions(candidate, matched, missing):
        """
        Creates 3 high-impact tactical interview questions.
        """
        user_prompt = f"""
        Candidate: {candidate.name} | Matches: {', '.join(matched[:3])} | Missing: {', '.join(missing[:2]) if missing else 'None'}

        Task: Generate 3 probe sequences:
        1. Technical Validation: Core tech depth.
        2. Bridge Strategy: How they handle the missing {missing[0] if missing else 'tech'}.
        3. Experience Scaling: Behavioral question for {candidate.experience} year level.

        Return ONLY JSON: {{"questions": ["...", "...", "..."]}}
        """
        try:
            raw = LLMClient.chat("You are a Lead Technical Interviewer.", user_prompt)
            clean_json = raw.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_json).get("questions", [])
        except:
            return [
                "Describe your most complex technical architecture.",
                "How do you adapt to unfamiliar technology stacks?",
                "Provide an example of handling shifting technical requirements."
            ]
