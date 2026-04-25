import os
from openai import OpenAI
from app.config import settings

class LLMClient:
    client = OpenAI(
        api_key=settings.OPENAI_API_KEY,
        base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    )

    @staticmethod
    def chat(system_prompt, user_prompt):
        try:
            # 🟢 HEARTBEAT: See when a request starts
            print(f"🚀 Sending request to {settings.MODEL_NAME}...", flush=True)

            response = LLMClient.client.chat.completions.create(
                model=settings.MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                # Ensure temperature is low for consistent JSON
                temperature=0.1,
                # Explicitly force JSON mode if requested
                response_format={"type": "json_object"} 
            )
            return response.choices[0].message.content
        except Exception as e:
            # 🔴 If the API key is wrong or the provider is down, you see it here!
            print(f"❌ LLM CLIENT ERROR: {str(e)}", flush=True)
            # Return a valid JSON string so the parser doesn't crash on json.loads
            return '{"is_valid": false, "reason": "LLM Provider Error"}'