# 🧠 Scoring Logic & Match Engine

This document outlines the multi-stage evaluation pipeline used to rank candidates against Job Descriptions. The engine utilizes a **Weighted Normalized Scoring** model across three distinct pillars: Technical Skills, Professional Experience, and Semantic Context.

---

## 🏗️ 1. The Scoring Pillars

### A. Technical Skill Match ($S_{skill}$)
This pillar measures the literal overlap between the required skills and the candidate's verified stack.

* **Mechanism:** Uses **Pydantic** for schema validation and exact keyword matching (including common aliases like "RoR" for "Ruby on Rails").
* **Formula:** $$S_{skill} = \frac{\text{Count of Matched Skills}}{\text{Total Required Skills in JD}}$$
* **Weighting:** This is typically the highest-weighted component to ensure baseline technical competency.

### B. Experience Alignment ($S_{exp}$)
This pillar evaluates the candidate's seniority relative to the JD requirements.

* **Mechanism:** A linear threshold function.
* **Logic:**
    * If $Candidate_{years} \ge JD_{required}$, score = **1.0**
    * If $Candidate_{years} < JD_{required}$, score = $\frac{Candidate_{years}}{JD_{required}}$
* **Purpose:** It prevents "hard rejection" of talented candidates who might be only slightly under the requested year count.

### C. Semantic Context ($S_{semantic}$)
The "Vibe Check" that identifies hidden matches based on project descriptions and role responsibilities.

* **Mechanism:** Utilizes **Sentence Transformers** (`all-MiniLM-L6-v2`) to generate vector embeddings.
* **Calculation:** Performs a **Cosine Similarity** between vectors:
    $$\text{Similarity} = \cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$$
* **Value:** Catches candidates who have relevant experience but use different terminology than the JD.

---

## ⚖️ 2. Final Weighted Calculation

The final score displayed on the dashboard is a **Dynamic Weighted Sum**. This allows recruiters to tune the engine in real-time using the frontend sliders.

$$Final\ Score = (S_{skill} \times W_{skill}) + (S_{exp} \times W_{exp}) + (S_{semantic} \times W_{semantic})$$

> **Note:** The weights ($W$) always sum to **1.0 (100%)**. As you move one slider, the others adjust to maintain this balance.

---

## 🤖 3. Interest & Insight Simulation

Once the mathematical ranking is complete, the **InterestAgent** performs a qualitative analysis on the top-tier candidates:

* **Pitch Generation:** Converts the delta between scores into a natural language "Why this candidate" summary.
* **Gap Analysis:** Specifically flags "Missing Skills" from the JD that the candidate should be grilled on.
* **Interview Scripting:** Generates 3 dynamic questions:
    1.  **Technical:** Deep dive into their strongest matched skill.
    2.  **Bridge:** How they plan to overcome a specific missing skill.
    3.  **Behavioral:** Scenario-based on their specific experience level.

---

## 📊 4. Talent Distribution

The dashboard categorizes candidates into three tiers based on the final score:

* 🟢 **Top Tier (> 0.7):** Ready for immediate interview.
* 🟡 **Potential (0.4 - 0.7):** Strong matches with minor gaps or lower experience.
* 🔴 **Rejects (< 0.4):** Significant misalignment in core requirements.

---

## 🚀 Technical Stack

| Component | Technology |
| :--- | :--- |
| **Validation** | Pydantic |
| **NLP** | Sentence-Transformers (HuggingFace) |
| **Inference** | Groq Cloud (Llama 3.1) |
| **Processing** | NumPy / Python FastAPI |
