# Job Description

**Format:** Unstructured Text  
**Source:** Recruiter Input

```text
"We are looking for a Senior Full Stack Developer with at least 3 years of experience. 
The core tech stack includes React.js, Node.js, and MongoDB. 
Experience with TypeScript and cloud deployment (AWS/Azure) is a major plus. 
The candidate will be responsible for designing scalable system architectures and leading a small team."
```

---

# Parsed Requirements
*Processed by:* JDParserAgent  
*Purpose:* Normalizing the JD into strict constraints for the Matcher Engine.

```json
{
  "role": "Senior Full Stack Developer",
  "experience_min": 3,
  "skills": ["React.js", "Node.js", "MongoDB", "TypeScript", "AWS"],
  "location": "Remote / Not Specified",
  "ai_summary": "Architecture-focused role requiring full-stack proficiency and leadership."
}
```

---

# Candidate Profile Data Pool
*Format:* Structured JSON  
*Source:* Pre-existing Candidate Database

```json
{
  "candidate_id": "C-101",
  "name": "Nagga Sai",
  "total_experience": 4,
  "skills": ["React.js", "Node.js", "Python", "FastAPI", "PostgreSQL"],
  "projects": "Developed an AI-driven talent scouting platform using a micro-agent architecture."
}
```

---

# Final Intelligence Dashboard Data
*Processed by:* MatcherEngine & InterestAgent  
*Purpose:* Final scores and qualitative insights displayed on the UI.

```json
{
  "candidate_id": "C-101",
  "name": "Nagga Sai",
  "skill_score": 0.80,
  "experience_score": 1.0,
  "semantic_score": 0.88,
  "final_score": 0.86,
  "interest_score": 0.85,
  **matched_skills:** ["React.js", “Node.js”],
d **missing_skills:** ["MongoDB", “TypeScript”],
d **explanation:** “Strong semantic alignment with project history | Meets experience criteria”,
d **ai_summary:** “Nagga is a high-potential candidate whose background in AI scouting platforms aligns perfectly with the architectural needs of this role.”, 
d **interview_questions:** [
