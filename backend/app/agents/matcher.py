from app.services.embedding import EmbeddingService

class MatchResult:
    def __init__(self, skill_score, exp_score, semantic_score):
        self.skill_score = skill_score
        self.exp_score = exp_score
        self.semantic_score = semantic_score

    @property
    def final_score(self):
        return (
            0.65 * self.skill_score +
            0.2 * self.exp_score +
            0.15 * self.semantic_score
        )

class MatcherAgent:
    @staticmethod
    def analyze_skills(required_skills, candidate_skills):
        """
        Pure Python logic to find gaps. 
        Costs 0 tokens but provides high value.
        """
        required = set([s.lower().strip() for s in required_skills])
        candidate = set([s.lower().strip() for s in candidate_skills])
        
        if not required:
            return 1.0, [], []

        matched = list(required.intersection(candidate))
        missing = list(required.difference(candidate))
        score = len(matched) / len(required)
        
        return score, matched, missing

    @staticmethod
    def compute_experience_score(required_exp, candidate_exp):
        if required_exp == 0: return 1.0
        if candidate_exp >= required_exp: return 1.0
        return max(0.0, candidate_exp / required_exp)

    @staticmethod
    def match(jd, candidate):
        jd_skills = jd.skills if hasattr(jd, 'skills') else jd.get('skills', [])
        jd_exp = jd.experience_min if hasattr(jd, 'experience_min') else jd.get('experience_min', 0)
        jd_role = jd.role if hasattr(jd, 'role') else jd.get('role', '')

        skill_score, matched, missing = MatcherAgent.analyze_skills(jd_skills, candidate.skills)
        exp_score = MatcherAgent.compute_experience_score(jd_exp, candidate.experience)

        semantic_input = f"Role: {jd_role}. Required Skills: {', '.join(jd_skills)}"
        semantic = EmbeddingService.similarity(semantic_input, candidate.resume_text)

        result = MatchResult(skill_score, exp_score, semantic)
        final_score = result.final_score

        if skill_score == 0:
            final_score *= 0.4 

        return {
            "candidate_id": candidate.id,
            "name": candidate.name,
            "skill_score": round(skill_score, 3),
            "experience_score": round(exp_score, 3),
            "semantic_score": round(semantic, 3),
            "final_score": round(final_score, 3),
            "matched_skills": matched,  # 🚀 New field
            "missing_skills": missing,  # 🚀 New field
            "explanation": MatcherAgent.explain(skill_score, exp_score, semantic, missing)
        }

    @staticmethod
    def explain(skill, exp, semantic, missing):
        reasons = []
    
        if skill > 0.8: 
            reasons.append("Excellent skill alignment")
        elif skill > 0.4: 
            reasons.append("Good core skill match")
        elif missing: 
            reasons.append(f"Gap in {missing[0]}") 
        else:
            reasons.append("Technical requirements not fully met")

        if exp == 1.0: 
            reasons.append("Meets experience criteria")
        elif exp > 0.6: 
            reasons.append("Near-target experience level")
        else: 
            reasons.append("Limited relevant experience")

        if semantic > 0.7: 
            reasons.append("High context relevance")

        return " | ".join(reasons)
