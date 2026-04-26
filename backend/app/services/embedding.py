from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")


class EmbeddingService:

    @staticmethod
    def get_embedding(text: str):
        return model.encode([text])[0]

    @staticmethod
    def similarity(text1: str, text2: str) -> float:
        emb1 = model.encode([text1])
        emb2 = model.encode([text2])
        return float(cosine_similarity(emb1, emb2)[0][0])
