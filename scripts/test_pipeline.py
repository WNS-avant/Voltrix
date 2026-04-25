import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.agents.jd_parser import JDParserAgent
from app.services.candidate_store import CandidateStore
from app.agents.matcher import MatcherAgent

jd_text = "Looking for a Java backend developer with Spring Boot and AWS, 3+ years"

store = CandidateStore()
jd = JDParserAgent.parse(jd_text)

results = []

for c in store.get_all():
    match = MatcherAgent.match(jd, c)
    results.append(match)

results.sort(key=lambda x: x["final_score"], reverse=True)

print("\nTop Candidates:\n")

for r in results[:3]:
    print(r["name"], "->", r["final_score"], "|", r["explanation"])