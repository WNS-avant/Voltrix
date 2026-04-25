import { useState } from "react";
import { evaluateInterest } from "../services/api";

export default function ChatPanel() {
  const [conversation, setConversation] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 Added loading
  const [result, setResult] = useState<any>(null);

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const res = await evaluateInterest({
        candidate_name: "Demo Candidate",
        role: "Backend Engineer",
        conversation,
      });
      // res usually contains { interest_score, analysis, summary }
      setResult(res);
    } catch (error) {
      alert("Analysis failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <h2 style={{ color: "#818cf8" }}>🧠 Behavioral Interest Analysis</h2>

      <textarea
        style={styles.textArea}
        rows={6}
        value={conversation}
        onChange={(e) => setConversation(e.target.value)}
        placeholder="Paste the recruiter-candidate chat here (e.g., 'Candidate: I am very excited about the tech stack...')"
      />

      <button 
        onClick={handleEvaluate} 
        disabled={loading || !conversation.trim()}
        style={styles.evalBtn}
      >
        {loading ? "Analyzing Intent..." : "Evaluate Interest"}
      </button>

      {result && (
        <div style={styles.resultsBox}>
          <h3>Result: {(result.interest_score * 100).toFixed(0)}% Interest</h3>
          <p><strong>Summary:</strong> {result.summary}</p>
          <div style={styles.metrics}>
             <span>Enthusiasm: {result.analysis?.enthusiasm * 100}%</span>
             <span>Availability: {result.analysis?.availability * 100}%</span>
             <span>Salary Fit: {result.analysis?.salary_fit * 100}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: any = {
    chatContainer: { marginTop: 40, padding: '20px', background: '#1e293b', borderRadius: '12px' },
    textArea: { width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '8px' },
    evalBtn: { marginTop: '12px', padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    resultsBox: { marginTop: '20px', padding: '15px', background: '#334155', borderRadius: '8px', borderLeft: '4px solid #818cf8' },
    metrics: { display: 'flex', gap: '15px', fontSize: '12px', marginTop: '10px', color: '#94a3b8' }
}