import { useState } from "react";
import { evaluateInterest } from "../services/api";

export default function ChatPanel() {
  const [conversation, setConversation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const res = await evaluateInterest({
        candidate_name: "Demo Candidate",
        role: "Backend Engineer",
        conversation,
      });
      setResult(res);
    } catch (error) {
      alert("SIGNAL_LOST: Analysis failed. Check backend uplink.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-slab" style={styles.chatContainer}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>BEHAVIORAL_INTENT_ANALYSIS</h2>
        <span className="live-market-badge">NEURAL_ENGINE_V2</span>
      </div>

      <div style={styles.inputWrapper}>
        <span style={styles.inputLabel}>RAW_CONVERSATION_DATA</span>
        <textarea
          className="custom-textarea"
          rows={6}
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          placeholder="PASTE_UPLINK_DATA: 'Candidate: I am very excited about the tech stack...'"
        />
      </div>

      <button 
        onClick={handleEvaluate} 
        disabled={loading || !conversation.trim()}
        className="eval-btn-neon"
      >
        {loading ? "DECRYPTING_INTENT..." : "[ EXECUTE_EVALUATION ]"}
      </button>

      {result && (
        <div className="result-slab-animate" style={styles.resultsBox}>
          <div style={styles.scoreRow}>
             <h3 style={styles.scoreTitle}>INTENT_PROBABILITY:</h3>
             <span className="final-score-glow">{(result.interest_score * 100).toFixed(0)}%</span>
          </div>
          
          <div className="summary-glass" style={{ marginTop: '15px' }}>
            <span style={styles.insightLabel}>SYNTHESIZED_SUMMARY</span>
            <p style={styles.summaryText}>{result.summary}</p>
          </div>

          <div style={styles.metricsGrid}>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>ENTHUSIASM</span>
                <div className="mini-bar"><div style={{ ...styles.fill, width: `${result.analysis?.enthusiasm * 100}%` }} /></div>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>AVAILABILITY</span>
                <div className="mini-bar"><div style={{ ...styles.fill, width: `${result.analysis?.availability * 100}%` }} /></div>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>SALARY_FIT</span>
                <div className="mini-bar"><div style={{ ...styles.fill, width: `${result.analysis?.salary_fit * 100}%` }} /></div>
              </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-textarea {
          width: 100%;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .custom-textarea:focus {
          border-color: #00f2ff;
          box-shadow: 0 0 15px rgba(0, 242, 255, 0.1);
        }
        .eval-btn-neon {
          margin-top: 20px;
          width: 100%;
          padding: 14px;
          background: rgba(0, 242, 255, 0.05);
          color: #00f2ff;
          border: 1px solid #00f2ff;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'JetBrains Mono';
          font-weight: bold;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }
        .eval-btn-neon:hover:not(:disabled) {
          background: #00f2ff;
          color: #000;
          box-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
        }
        .eval-btn-neon:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          border-color: #475569;
          color: #475569;
        }
        .mini-bar {
          height: 4px;
          background: rgba(255,255,255,0.05);
          width: 100%;
          margin-top: 5px;
          border-radius: 2px;
        }
        .result-slab-animate {
          animation: slideIn 0.5s ease-out forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  chatContainer: { 
    marginTop: 40, 
    width: '100%', 
    maxWidth: '900px'
  },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: "14px", letterSpacing: "4px", color: "#475569", margin: 0 },
  inputWrapper: { display: 'flex', flexDirection: 'column', gap: '10px' },
  inputLabel: { fontSize: '10px', color: '#475569', fontFamily: 'JetBrains Mono', letterSpacing: '1px' },
  resultsBox: { 
    marginTop: '30px', 
    padding: '25px', 
    background: 'rgba(255, 255, 255, 0.02)', 
    borderRadius: '16px', 
    border: '1px solid rgba(0, 242, 255, 0.1)' 
  },
  scoreRow: { display: 'flex', alignItems: 'center', gap: '15px' },
  scoreTitle: { fontSize: '12px', color: '#fff', letterSpacing: '2px', margin: 0 },
  insightLabel: { color: "#00f2ff", fontWeight: "bold", display: "block", marginBottom: "8px", fontSize: "9px", letterSpacing: "1px" },
  summaryText: { fontSize: "14px", color: "#94a3b8", lineHeight: '1.6', margin: 0 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '25px' },
  metricItem: { display: 'flex', flexDirection: 'column' },
  metricLabel: { fontSize: '9px', color: '#475569', fontWeight: 'bold' },
  fill: { height: '100%', background: '#00f2ff', boxShadow: '0 0 8px #00f2ff' }
}
