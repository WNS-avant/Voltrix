import os
from pathlib import Path
from dotenv import load_dotenv

print(f"Current Working Directory: {os.getcwd()}")

base_dir = Path(__file__).resolve().parent
env_path = base_dir / ".env"
print(f"Looking for .env at: {env_path}")
print(f"Does .env exist? {env_path.exists()}")

load_dotenv(dotenv_path=env_path)

key = os.getenv("OPENAI_API_KEY", "")
print("-" * 30)
if not key:
    print("❌ RESULT: No API Key found. Your .env might be in the wrong folder.")
else:
    print(f"✅ RESULT: Key found!")
    print(f"Key Length: {len(key)}")
    print(f"Starts with: {key[:10]}...")
print("-" * 30)
