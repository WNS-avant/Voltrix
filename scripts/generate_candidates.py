import json
import uuid
import random

skills_pool = [
    "java", "spring boot", "aws", "docker", "kubernetes",
    "python", "react", "node.js", "sql", "mongodb"
]

roles = [
    "Backend Engineer", "Full Stack Developer",
    "Software Engineer", "Platform Engineer"
]


def generate_candidate():
    selected_skills = random.sample(skills_pool, random.randint(3, 6))

    return {
        "id": str(uuid.uuid4())[:8],
        "name": random.choice([
            "Arjun Reddy", "Priya Sharma", "Rahul Verma",
            "Sneha Iyer", "Kiran Kumar", "Ananya Gupta"
        ]) + " " + str(random.randint(1, 99)),
        "skills": selected_skills,
        "experience": round(random.uniform(1, 6), 1),
        "current_role": random.choice(roles),
        "expected_salary": random.randint(6, 20),
        "location": "India",
        "resume_text": f"Experienced in {' '.join(selected_skills)} with hands-on project development."
    }


def main():
    candidates = [generate_candidate() for _ in range(25)]

    with open("data/candidates.json", "w") as f:
        json.dump(candidates, f, indent=2)

    print("Generated 25 candidates successfully!")


if __name__ == "__main__":
    main()