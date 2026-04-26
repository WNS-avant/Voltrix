from pydantic import BaseModel
from typing import List, Optional


class Candidate(BaseModel):
    id: str
    name: str
    skills: List[str]
    experience: float
    current_role: str
    expected_salary: Optional[int]
    location: Optional[str]
    resume_text: str
