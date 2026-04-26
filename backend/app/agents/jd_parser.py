from app.services.llm_client import LLMClient
from app.models.jd import ParsedJD
import json
import re

SYSTEM_PROMPT = """
You are an Expert HR Intelligence System specializing in Job Description (JD) Parsing.

### STEP 1: STRICT VALIDATION CRITERIA
Your primary task is to distinguish between a "Recruiter/Employer posting a Job" and "Job Seekers/Jargon."

- VALID JD (is_valid: true): 
  * Explicit hiring intent: "We are looking for...", "Hiring a...", "Open position for..."
  * Requirement lists: A role title combined with a list of required technical skills.
  * Professional JD: Multi-paragraph descriptions of company roles and responsibilities.

- INVALID (is_valid: false):
  * JOB SEEKERS: Text like "I am looking for a job", "Here is my resume", or "I have 5 years experience in Java." (This is a Candidate, not a JD).
  * GIBBERISH: Random characters, non-hiring questions (e.g., "What is AI?"), or greetings.
  * AMBIGUOUS: Self-promotions or general LinkedIn-style "Open to Work" posts.

### STEP 2: STRUCTURED EXTRACTION
Only if is_valid is true, extract the following:
1. ROLE: The specific job title.
2. SKILLS: A flat list of technical skills. Normalize (e.g., "ReactJS" -> "react", "Node.js" -> "node.js").
3. EXPERIENCE_MIN: The minimum years of experience. If a range is given (e.g., "3-5 years"), take the lower number (3). If not mentioned, use 0.
4. SENIORITY: Categorize as: junior, mid, senior, lead, or null.
5. LOCATION: Extract the city or 'Remote' if specified.
6. AI_SUMMARY: A professional, one-sentence summary of the target profile (e.g., "Expert ML Engineer with a focus on production NLP pipelines").

### OUTPUT RULES:
- Return ONLY a raw JSON object. No conversational filler or markdown blocks.
- If is_valid is false, set all other fields (except 'reason') to null or empty.

### JSON FORMAT:
{
  "is_valid": boolean,
  "reason": "Explain WHY it was rejected (e.g., 'Detected Job Seeker intent instead of Hiring intent') or null if valid",
  "role": "string",
  "skills": ["string"],
  "experience_min": float,
  "seniority": "string | null",
  "location": "string"
  "ai_summary": "string"
}
"""

SKILL_MAP = {
    "reactjs": "react",
    "react.js": "react",
    "node": "node.js",
    "nodejs": "node.js",
    "ml": "machine learning",
    "ai": "machine learning",
    "nlp": "nlp",
    "tensorflow": "tensorflow",
    "pytorch": "pytorch",
    "aws": "aws",
    "spring": "spring boot",
    "springboot": "spring boot"
}

KNOWN_SKILLS = [
    "react", "node.js", "mongodb", "javascript",
    "java", "spring boot", "aws", "docker", "kubernetes",
    "python", "tensorflow", "pytorch", "nlp", "machine learning"
]

class JDParserAgent:

    @staticmethod
    def normalize_skills(skills):
        normalized = []
        for skill in skills:
            skill = skill.lower().strip()
            parts = re.split(r",|/| or ", skill)
            for p in parts:
                p = p.strip()
                if p in SKILL_MAP:
                    p = SKILL_MAP[p]
                normalized.append(p)
        return list(set(normalized))

    @staticmethod
    def enrich_from_text(jd_text, existing_skills):
        text = jd_text.lower()
        for skill in KNOWN_SKILLS:
            if skill in text and skill not in existing_skills:
                existing_skills.append(skill)
        return existing_skills

    @staticmethod
    def normalize_experience(exp_raw: any) -> float:
        """
        Extracts numeric values from raw input and handles unit conversion.
        Ensures '6 months' becomes 0.5 and '3.5 years' stays 3.5.
        """
        if exp_raw is None: 
            return 0.0
        
        s = str(exp_raw).lower().strip()
        
        numbers = re.findall(r"[-+]?\d*\.\d+|\d+", s)
        if not numbers:
            return 0.0
        
        val = float(numbers[0])

        if "month" in s:
            return round(val / 12, 2)
            
        return val

    @staticmethod
    def parse(jd_text: str) -> ParsedJD:
        user_prompt = f"Job Description:\n{jd_text}"
        
        try:
            response = LLMClient.chat(SYSTEM_PROMPT, user_prompt)
            print(f"--- RAW LLM RESPONSE ---\n{response}\n-----------------------", flush=True)

            clean_response = response.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_response)
            
            print(f"DEBUG: is_valid={data.get('is_valid')} | role={data.get('role')}", flush=True)

            if not data.get("is_valid", True):
                return ParsedJD(
                    role="Invalid", 
                    is_valid=False,
                    friendly_message=data.get("reason", "Not a valid job description.")
                )

            raw_skills = data.get("skills", [])
            normalized = JDParserAgent.normalize_skills(raw_skills)
            final_skills = JDParserAgent.enrich_from_text(jd_text, normalized)

            exp_raw = data.get("experience_min", 0)
            exp_val = JDParserAgent.normalize_experience(exp_raw)

            return ParsedJD(
                role=str(data.get("role", "Unknown")),
                skills=final_skills,
                experience_min=exp_val,
                seniority=data.get("seniority"),
                location=data.get("location", "Remote"),
                ai_summary=data.get("ai_summary", "Vector analysis complete."),
                is_valid=True
            )

        except Exception as e:
            print(f"CRITICAL ERROR IN PARSE: {str(e)}", flush=True)
            return ParsedJD(
                role="Error", 
                skills=[], 
                experience_min=0.0, 
                is_valid=False, 
                friendly_message=f"Agent Error: {str(e)}"
            )
