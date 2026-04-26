from pydantic import BaseModel
from typing import List, Optional

class JobDescription(BaseModel):
    text: str

class ParsedJD(BaseModel):
    role: str = "Unknown"
    skills: List[str] = []
    experience_min: int = 0
    seniority: Optional[str] = None
    is_valid: bool = True  
    friendly_message: Optional[str] = None
