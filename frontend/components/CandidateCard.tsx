export default function CandidateCard({ candidate }: any) {
  const getBadgeStyles = () => {
    if (candidate.final_score > 0.75) return { border: "#00ff00", text: "#00ff00", label: "CRITICAL_ASSET", shadow: "rgba(0, 255, 0, 0.2)" };
    if (candidate.final_score > 0.6) return { border: "#00f2ff", text: "#00f2ff", label: "HIGH_PROBABILITY", shadow: "rgba(0, 242, 255, 0.2)" };
    if (candidate.mode === "fallback_semantic") return { border: "#a855f7", text: "#a855f7", label: "NEURAL_EXPANSION", shadow: "rgba(168, 85, 247, 0.2)" };
    return { border: "#ef4444", text: "#ef4444", label: "LOW_VIABILITY", shadow: "rgba(239, 68, 68, 0.2)" };
  };

  const badge = getBadgeStyles();

  const getBarColor = (score: number) => {
    if (score >= 0.75) return "linear-gradient(90deg, #00ff00, #4ade80)"; 
    if (score >= 0.5) return "linear-gradient(90deg, #eab308, #fbbf24)";  
    return "linear-gradient(90deg, #ef4444, #f87171)";                    
  };

  return (
    <div className="candidate-glass-card" style={styles.card}>
      <div style={styles.header}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={styles.rank}>UNIT_ID: 00{candidate.rank}</span>
          <h3 style={styles.name}>{candidate.name.toUpperCase()}</h3>
        </div>
        <span style={{ 
          ...styles.badge, 
          borderColor: badge.border, 
          color: badge.text,
          boxShadow: `inset 0 0 10px ${badge.shadow}` 
        }}>
          {badge.label}
        </span>
      </div>

      <div style={styles.skillSection}>
        {candidate.matched_skills?.map((s: string) => (
          <span key={s} className="pill-tactical pill-match">● {s.toUpperCase()}</span>
        ))}
        {candidate.missing_skills?.map((s: string) => (
          <span key={s} className="pill-tactical pill-gap">○ {s.toUpperCase()}</span>
        ))}
      </div>

      <div style={styles.metricGrid}>
        {[
          { label: "SKILL_MATCH", val: candidate.skill_score },
          { label: "EXPERIENCE", val: candidate.experience_score },
          { label: "SEMANTIC", val: candidate.semantic_score },
          { label: "INTEREST", val: candidate.interest_score },
        ].map((item) => (
          <div key={item.label} style={styles.metricItem}>
            <div style={styles.metricLabelRow}>
              <span>{item.label}</span>
              <span style={{ color: '#fff' }}>{(item.val * 100).toFixed(0)}%</span>
            </div>
            <div style={styles.barBg}>
              <div
                style={{
                  width: `${item.val * 100}%`,
                  height: "100%",
                  background: getBarColor(item.val),
                  boxShadow: `0 0 8px ${getBarColor(item.val).includes('#00ff00') ? 'rgba(0,255,0,0.4)' : 'transparent'}`,
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      <div style={styles.aiSection}>
        {candidate.ai_summary && (
          <div className="insight-slab">
            <span style={styles.insightLabel}>NEURAL_ANALYSIS_SUMMARY</span>
            <p style={styles.summaryText}>{candidate.ai_summary}</p>
          </div>
        )}
      </div>

      {candidate.interview_questions && candidate.interview_questions.length > 0 && (
        <div style={styles.interviewSection}>
          <span style={styles.interviewLabel}>PROBE_SEQUENCES:</span>
          <div style={styles.questionList}>
            {candidate.interview_questions.map((q: string, i: number) => (
              <div key={i} style={styles.questionItem}>
                <span className="q-number">{i + 1}</span>
                {q}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <span style={styles.footerLabel}>AGGREGATE_MATCH_PROBABILITY</span>
        <span className="final-score-glow">{(candidate.final_score * 100).toFixed(1)}%</span>
      </div>

      <style jsx>{`
        .candidate-glass-card {
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .candidate-glass-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(0, 242, 255, 0.5) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,242,255,0.05) !important;
        }
        .pill-tactical {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          padding: 3px 8px;
          border-radius: 2px;
          letter-spacing: 1px;
        }
        .pill-match { color: #4ade80; background: rgba(74, 222, 128, 0.1); }
        .pill-gap { color: #f87171; background: rgba(248, 113, 113, 0.05); border: 1px solid rgba(248, 113, 113, 0.1); }
        
        .insight-slab {
          background: rgba(255, 255, 255, 0.02);
          padding: 15px;
          border-left: 2px solid #00f2ff;
          border-radius: 0 8px 8px 0;
        }
        .final-score-glow {
          font-size: 28px;
          font-weight: 900;
          color: #fff;
          text-shadow: 0 0 15px rgba(0, 242, 255, 0.6);
        }
        .q-number {
          color: #00f2ff;
          font-family: 'JetBrains Mono';
          margin-right: 10px;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  card: {
    backdropFilter: "blur(25px) saturate(200%)",
    background: "rgba(10, 15, 25, 0.4)",
    padding: "30px",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    fontFamily: "'Outfit', sans-serif",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "25px" },
  rank: { fontSize: "10px", color: "#475569", fontFamily: "'JetBrains Mono'", letterSpacing: "2px" },
  name: { margin: "5px 0 0 0", fontSize: "22px", fontWeight: "900", letterSpacing: "-0.5px" },
  badge: { 
    padding: "4px 12px", 
    borderRadius: "4px", 
    fontSize: "9px", 
    fontWeight: "bold", 
    border: "1px solid",
    fontFamily: "'JetBrains Mono'"
  },
  
  skillSection: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "25px" },
  metricGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" },
  metricItem: { display: "flex", flexDirection: "column", gap: "8px" },
  metricLabelRow: { display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#475569", fontWeight: "bold" },
  barBg: { width: "100%", height: "4px", background: "rgba(255, 255, 255, 0.05)", overflow: "hidden" },
  divider: { height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", margin: "0 -30px 25px -30px" },
  
  aiSection: { display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" },
  insightLabel: { color: "#00f2ff", fontWeight: "bold", display: "block", marginBottom: "8px", fontSize: "9px", letterSpacing: "1px" },
  summaryText: { fontSize: "13px", lineHeight: "1.6", color: "#94a3b8", margin: 0 },
  
  interviewSection: {
    padding: "20px",
    background: "rgba(0, 242, 255, 0.02)",
    borderRadius: "12px",
    border: "1px solid rgba(0, 242, 255, 0.1)",
    marginBottom: "25px"
  },
  interviewLabel: { fontSize: "10px", fontWeight: "bold", color: "#00f2ff", letterSpacing: "2px", display: "block", marginBottom: "15px" },
  questionList: { display: "flex", flexDirection: "column", gap: "12px" },
  questionItem: { fontSize: "12px", color: "#cbd5e1", lineHeight: "1.5", display: "flex" },
  
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px" },
  footerLabel: { fontSize: "9px", color: "#475569", fontWeight: "bold", letterSpacing: "1px" }
};
