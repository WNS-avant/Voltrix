export default function CandidateCard({ candidate }: any) {
  const getBadgeStyles = () => {
    if (candidate.final_score > 0.75) return { bg: "#064e3b", text: "#6ee7b7", label: "🔥 Top Talent" };
    if (candidate.final_score > 0.6) return { bg: "#1e3a8a", text: "#93c5fd", label: "✅ Strong Fit" };
    if (candidate.mode === "fallback_semantic") return { bg: "#4c1d95", text: "#ddd6fe", label: "🧠 Semantic Match" };
    return { bg: "#450a0a", text: "#fca5a5", label: "⚠️ Low Fit" };
  };

  const badge = getBadgeStyles();

  const getBarColor = (score: number) => {
    if (score >= 0.75) return "#22c55e"; 
    if (score >= 0.5) return "#eab308";  
    return "#ef4444";                    
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={styles.rank}>Rank #{candidate.rank}</span>
          <h3 style={styles.name}>{candidate.name}</h3>
        </div>
        <span style={{ ...styles.badge, background: badge.bg, color: badge.text }}>
          {badge.label}
        </span>
      </div>

      <div style={styles.skillSection}>
        {candidate.matched_skills?.map((s: string) => (
          <span key={s} style={{ ...styles.pill, ...styles.matchPill }}>✓ {s}</span>
        ))}
        {candidate.missing_skills?.map((s: string) => (
          <span key={s} style={{ ...styles.pill, ...styles.gapPill }}>✕ {s}</span>
        ))}
      </div>

      <div style={styles.metricGrid}>
        {[
          { label: "Skill Match", val: candidate.skill_score },
          { label: "Experience", val: candidate.experience_score },
          { label: "Semantic", val: candidate.semantic_score },
          { label: "Interest", val: candidate.interest_score },
        ].map((item) => (
          <div key={item.label} style={styles.metricItem}>
            <div style={styles.metricLabelRow}>
              <span>{item.label}</span>
              <span>{(item.val * 100).toFixed(0)}%</span>
            </div>
            <div style={styles.barBg}>
              <div
                style={{
                  width: `${item.val * 100}%`,
                  height: "100%",
                  borderRadius: "6px",
                  background: getBarColor(item.val),
                  transition: "width 0.5s ease-out",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      <div style={styles.aiSection}>
        {candidate.ai_summary && (
          <div style={styles.insightBox}>
            <span style={{ color: "#818cf8", fontWeight: "bold", display: "block", marginBottom: "4px", fontSize: "10px" }}>✨ AI INSIGHT</span>
            {candidate.ai_summary}
          </div>
        )}
        
        <div style={styles.interestBox}>
          <span style={{ marginRight: "8px" }}>🤖</span>
          {candidate.explanation}
        </div>
      </div>

{candidate.interview_questions && candidate.interview_questions.length > 0 && (
  <div style={styles.interviewSection}>
    <span style={styles.interviewLabel}> Suggested Interview Questions:</span>
    <ul style={styles.questionList}>
      {candidate.interview_questions.map((q: string, i: number) => (
        <li key={i} style={styles.questionItem}>
          <span style={styles.questionNumber}>{i + 1}</span>
          {q}
        </li>
      ))}
    </ul>
  </div>
)}

      <div style={styles.footer}>
        <span>Final Match Score</span>
        <span style={styles.finalScore}>{(candidate.final_score * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

const styles: any = {
  card: {
    backdropFilter: "blur(16px) saturate(180%)",
    background: "rgba(17, 25, 40, 0.75)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.125)",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "20px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  rank: { fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" },
  name: { margin: "2px 0 0 0", fontSize: "18px", fontWeight: "700" },
  badge: { padding: "4px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "600" },
  
  // New Skill Styles
  skillSection: { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" },
  pill: { fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: "500" },
  matchPill: { background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.2)" },
  gapPill: { background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" },

  metricGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
  metricItem: { display: "flex", flexDirection: "column", gap: "6px" },
  metricLabelRow: { display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" },
  barBg: { width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "6px", overflow: "hidden" },
  divider: { height: "1px", background: "rgba(255, 255, 255, 0.1)", margin: "0 -24px 20px -24px" },
  
  aiSection: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" },
  insightBox: {
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#cbd5e1",
    background: "rgba(99, 102, 241, 0.08)",
    padding: "12px",
    borderRadius: "8px",
    borderLeft: "3px solid #6366f1",
  },
  interestBox: { fontSize: "12px", color: "#94a3b8", fontStyle: "italic" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" },
  finalScore: { fontSize: "22px", fontWeight: "800", color: "#818cf8" },
  interviewSection: {
    marginTop: "10px",
    padding: "16px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "12px",
    border: "1px dashed rgba(129, 140, 248, 0.3)",
  },
  interviewLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#818cf8",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "10px",
  },
  questionList: {
    padding: 0,
    margin: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  questionItem: {
    fontSize: "12px",
    color: "#cbd5e1",
    lineHeight: "1.4",
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  },
  questionNumber: {
    background: "rgba(129, 140, 248, 0.2)",
    color: "#818cf8",
    fontSize: "10px",
    fontWeight: "bold",
    padding: "2px 6px",
    borderRadius: "4px",
    minWidth: "18px",
    textAlign: "center",
  }
};
