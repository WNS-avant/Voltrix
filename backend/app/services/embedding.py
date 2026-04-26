from openai import OpenAI
import os
import numpy as np

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class EmbeddingService:
    @staticmethod
    def get_embedding(text: str):
        """Fetches vector from OpenAI Cloud instead of local RAM."""
        try:
            response = client.embeddings.create(
                input=text,
                model="voyage-3" 
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Neural Uplink Error: {e}")
            return [0.0] * 1024 

    @staticmethod
    def similarity(text1: str, text2: str) -> float:
        """Computes similarity using numpy math (extremely low RAM)."""
        emb1 = np.array(EmbeddingService.get_embedding(text1))
        emb2 = np.array(EmbeddingService.get_embedding(text2))
        
        dot_product = np.dot(emb1, emb2)
        norm_a = np.linalg.norm(emb1)
        norm_b = np.linalg.norm(emb2)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
            
        return float(dot_product / (norm_a * norm_b))
