import os
import json
from app.models.candidate import Candidate


class CandidateStore:

    def __init__(self):
        base_dir = os.path.dirname(__file__)

        # Go to project root
        project_root = os.path.abspath(os.path.join(base_dir, "../../../"))
        self.path = os.path.join(project_root, "data", "candidates.json")

        print("📂 Loading candidates from:", self.path)

        self.candidates = self._load_candidates()

    def _load_candidates(self):
        with open(self.path, "r") as f:
            data = json.load(f)

        print(f"✅ Loaded {len(data)} candidates")
        print("👀 Sample:", [c["name"] for c in data[:5]])

        return [Candidate(**c) for c in data]

    def get_all(self):
        return self.candidates

    def get_by_id(self, candidate_id: str):
        for c in self.candidates:
            if c.id == candidate_id:
                return c
        return None