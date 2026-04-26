from pydantic import BaseModel
from typing import List, Optional

class JobDescription(BaseModel):
    text: str

class ParsedJD(BaseModel):
    role: str = "Unknown"
    skills: List[str] = []
    experience_min: float = 0.0
    seniority: Optional[str] = None
    is_valid: bool = True  
    ai_summary: Optional[str] = "Analysis Complete."
    location: Optional[str] = "Remote"
    friendly_message: Optional[str] = None
