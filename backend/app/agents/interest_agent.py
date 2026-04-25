from app.services.llm_client import LLMClient
import json

class InterestAgent:
    SYSTEM_PROMPT = """
    You are an Expert AI Talent Scout. Your job is to evaluate a candidate's fit and write a persuasive yet honest "Pitch" for a recruiter.
    
    RULES:
    - Return ONLY valid JSON.
    - Be concise, professional, and insightful.
    - Use the provided Matched/Missing skills to ensure accuracy.
    """

    @staticmethod
    def generate_insight(candidate, jd, matched, missing):
        """
        Generates both the Interest Score and the AI Pitch.
        """
        # 🔹 Contextual data for the LLM
        # We include the 'missing' skills so the AI can mention gaps honestly.
        user_prompt = f"""
        Role: {jd.role}
        Candidate: {candidate.name}
        Top Matched Skills: {', '.join(matched[:5])}
        Key Missing Skills: {', '.join(missing[:3]) if missing else 'None'}
        Experience: {candidate.experience} years
        
        TASK:
        1. Evaluate interest potential (0.0 to 1.0) based on role alignment.
        2. Write a 30-40 word 'Pitch' explaining WHY this candidate is a good/decent fit, 
           and mention if there's a specific skill gap to watch out for.

        Return JSON:
        {{
          "interest_score": float,
          "pitch": "string"
        }}
        """

        raw_response = LLMClient.chat(InterestAgent.SYSTEM_PROMPT, user_prompt)

        try:
            # Clean markdown formatting if present
            clean_json = raw_response.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_json)
            
            return {
                "interest_score": round(data.get("interest_score", 0.5), 2),
                "pitch": data.get("pitch", "Solid technical profile matching key requirements.")
            }

        except Exception as e:
            print(f"❌ Insight Error: {str(e)}")
            return {
                "interest_score": 0.5,
                "pitch": "Candidate shows relevant technical experience for the role."
            }

    @staticmethod
    def simulate(candidate, jd):
        """ 
        Legacy method kept for compatibility or deep-dive checks 
        """
        # ... (Your existing simulate code can stay here if needed)
        pass

    @staticmethod
    def generate_questions(candidate, matched, missing):
        """
        Creates 3 high-impact questions based on real skill gaps.
        """
        user_prompt = f"""
    Candidate: {candidate.name}
    Matches: {', '.join(matched[:3])}
    Missing: {', '.join(missing[:2]) if missing else 'None'}

    Task: Generate 3 interview questions:
    1. Technical: Validate their expertise in {matched[0] if matched else 'their core tech'}.
    2. Gap-filler: Ask how they would bridge the lack of {missing[0] if missing else 'industry-standard tools'}.
    3. Behavioral: A scenario-based question for a {candidate.experience} year professional.

    Return ONLY JSON: {{"questions": ["...", "...", "..."]}}
    """
    
        try:
            raw = LLMClient.chat("You are a Lead Technical Interviewer.", user_prompt)
            clean_json = raw.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_json).get("questions", [])
        except:
            return ["Describe your most complex technical project.", "How do you stay updated with new tech?", "How do you handle missing requirements?"]