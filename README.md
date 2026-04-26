# 🎯 Voltrix AI Talent Scout
### *AI-Driven Matchmaking & Interest Simulation Dashboard*

Voltrix is a sophisticated recruitment intelligence engine that moves beyond simple keyword matching. By utilizing a multi-agent architecture and semantic vector embeddings, it evaluates candidates based on technical skill alignment, professional seniority, and contextual project experience.

---

## 🚀 Core Features
- **Agentic JD Parsing:** Automatically extracts structured requirements from unstructured job descriptions.
- **Triple-Pillar Scoring:** A hybrid evaluation engine (Skill, Experience, and Semantic).
- **Dynamic Weighting:** Real-time re-ranking of candidates via interactive UI sliders.
- **InterestAgent Insights:** Generates AI-powered candidate pitches and custom-tailored interview scripts.
- **Glassmorphism Dashboard:** A high-end React interface for visual data analysis.

---

## 🏗️ System Architecture

The project is built as a decoupled pipeline, separating the heavy-lifting AI evaluation from the interactive frontend.

### Technology Stack
* **Frontend:** Next.js (React), TypeScript, Tailwind CSS
* **Backend:** FastAPI (Python), Pydantic
* **AI/ML:** Groq (Llama 3.1), Sentence Transformers (HuggingFace)
* **Data Handling:** NumPy, Vector Cosine Similarity

---

## 🧠 The Scoring Logic

The engine calculates a **Final Intelligence Score** using three normalized metrics:

1.  **Technical Skill Match ($S_{skill}$):** Strict keyword and alias matching.
2.  **Experience Alignment ($S_{exp}$):** Linear mapping of candidate seniority against requirements.
3.  **Semantic Context ($S_{semantic}$):** Vector-based "vibe check" using Cosine Similarity to find hidden project relevance.

**The Match Formula:**
$$Final\ Score = (S_{skill} \times W_{skill}) + (S_{exp} \times W_{exp}) + (S_{semantic} \times W_{semantic})$$

---

## 🧪 Sample Workflow

### 1. Input: Raw Job Description
> "Looking for a Senior Full Stack Developer with 3+ years in React and Node.js. Experience with AWS is a plus."
### 2. Parsed Output```json{
  "role": "Full Stack Developer",
  "experience_min": 3,
  "skills": ["React", "Node.js", "AWS"]
}


# 3. Intelligence Result

The dashboard visualizes the candidate as follows:

- **Rank:** #1

- **AI Pitch:** "Excellent fit for senior-level React architecture; matches cloud requirements."

- **Gap Analysis:** "Lacks explicit Node.js testing framework experience."

## 🛠️ Installation & Setup
### Backend (Python)
- Navigate to `/backend`
- Install dependencies: `pip install -r requirements.txt`
- Set your Groq API Key: `export GROQ_API_KEY='your_key_here'`
- Start the server: `uvicorn main:app --reload`

### Frontend (Next.js)
- Navigate to `/frontend`
- Install dependencies: `npm install`
- Start the dashboard: `npm run dev`

## 📊 Talent Distribution
The system provides a visual "Quality Bar" to help recruiters understand the density of the talent pool:

- 🟢 **Top Tier:** High-probability hires (>70%)
- 🟡 **Potential:** Candidates with transferable skills (40-70%)
- 🔴 **Rejects:** Significant alignment gaps (<40%)
