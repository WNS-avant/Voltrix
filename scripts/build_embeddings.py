import pickle
from app.services.embedding import EmbeddingService
from app.services.candidate_store import CandidateStore

store = CandidateStore()

embeddings = {}

for candidate in store.get_all():
    emb = EmbeddingService.get_embedding(candidate.resume_text)
    embeddings[candidate.id] = emb

with open("data/embeddings/candidate_embeddings.pkl", "wb") as f:
    pickle.dump(embeddings, f)

print("Embeddings saved!")