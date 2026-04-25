from typing import List, Dict

class RankingAgent:

    @staticmethod
    def compute_total_score(technical_match: float, interest_match: float):
        """
        Final synthesis: 
        60% weight on technical ability (Match Score)
        40% weight on human intent (Interest Score)
        """
        # 🛡️ THE "NINJA" GUARDRAIL: 
        # Even if they are super enthusiastic, if they can't do the job (Match < 0.2),
        # we cap their score so they don't jump to the top.
        if technical_match < 0.2:
            return round(technical_match * 0.8, 3) 

        return round(
            (0.6 * technical_match) + (0.4 * interest_match),
            3
        )

    @staticmethod
    def rank_candidates(candidates: List[Dict]):
        ranked = []

        for c in candidates:
            # We map the matcher's output 'final_score' to 'technical_match'
            technical_match = c.get("final_score", 0.0) 
            interest_match = c.get("interest_score", 0.0)

            total_score = RankingAgent.compute_total_score(
                technical_match,
                interest_match
            )

            ranked.append({
                **c, # Keep all previous data (id, name, skills, etc.)
                "total_score": total_score,
                "ranking_verdict": RankingAgent.generate_verdict(technical_match, interest_match, total_score)
            })

        # Sort by the new unified total score
        ranked.sort(key=lambda x: x["total_score"], reverse=True)

        return ranked

    @staticmethod
    def generate_verdict(tech_score: float, int_score: float, total: float):
        reasons = []

        # Tech Reasons
        if tech_score > 0.8: reasons.append("Strong technical alignment")
        elif tech_score > 0.5: reasons.append("Moderate skill match")
        else: reasons.append("Weak skill alignment")

        # Interest Reasons
        if int_score > 0.75: reasons.append("High enthusiasm")
        elif int_score > 0.4: reasons.append("Showing interest")
        else: reasons.append("Passive or low engagement")

        # The Verdict Label
        if total > 0.85: verdict = "🔥 Top Priority Candidate"
        elif total > 0.65: verdict = "✅ Good Fit"
        elif tech_score < 0.3: verdict = "❌ Skill Mismatch"
        else: verdict = "⚠️ Low Priority"

        return f"{verdict} | {' | '.join(reasons)}"