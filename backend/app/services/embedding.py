from openai import OpenAI
import os
import numpy as np

voyage_client = OpenAI(
    api_key=os.getenv("VOYAGE_API_KEY"),
    base_url="https://api.voyageai.com/v1"
)

class EmbeddingService:
    @staticmethod
    def get_embedding(text: str):
        try:
            response = voyage_client.embeddings.create(
                input=text,
                model="voyage-3" 
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Neural Uplink Error (Voyage): {e}")
            return [0.0] * 1024 

    @staticmethod
    def similarity(text1: str, text2: str) -> float:
        emb1 = np.array(EmbeddingService.get_embedding(text1))
        emb2 = np.array(EmbeddingService.get_embedding(text2))
        
        dot_product = np.dot(emb1, emb2)
        norm_a = np.linalg.norm(emb1)
        norm_b = np.linalg.norm(emb2)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
            
        return float(dot_product / (norm_a * norm_b))
