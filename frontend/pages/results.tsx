import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CandidateCard from "../components/CandidateCard";

export default function Results() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const [weights, setWeights] = useState({ skill: 0.65, exp: 0.20, semantic: 0.15 });
  

  
  useEffect(() => {
    const stored = localStorage.getItem("results");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div style={styles.loadingContainer}>
        <p>No intelligence data found.</p>
        <button onClick={() => router.push("/")} style={styles.backBtn}>Return to Input</button>
      </div>
    );
  }

  const candidates = data.matches || [];
  const parsed = data.parsed_jd;

const dynamicCandidates = candidates.map((c: any) => {
    const newScore = (
        (c.skill_score * weights.skill) + 
        (c.experience_score * weights.exp) + 
        (c.semantic_score * weights.semantic)
    );
    return { ...c, final_score: newScore };
}).sort((a: any, b: any) => b.final_score - a.final_score);

 
const shortlist = dynamicCandidates.filter(
  (c: any) => c.final_score > 0.7 && c.interest_score > 0.4 
);

  return (
    
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>🎯 Candidate Intelligence Dashboard</h1>
          <p style={styles.subtitle}>AI-Driven Matchmaking & Interest Simulation</p>
        </div>
        <button onClick={() => router.push("/")} style={styles.backBtn}>New Search</button>
      </header>

      <div style={styles.topGrid}>
        <div style={styles.parsedCard}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h4 style={styles.cardLabel}>Parsed Requirements</h4>
    <span style={styles.marketBadge}>Live Market Data</span>
  </div>

  <div style={styles.jdMainInfo}>
    <div style={styles.jdDetailItem}>
      <span style={styles.detailLabel}>TARGET ROLE</span>
      <span style={styles.detailValue}>{parsed?.role || "N/A"}</span>
    </div>
    <div style={styles.jdDetailItem}>
      <span style={styles.detailLabel}>REQUIRED EXPERIENCE</span>
      <span style={styles.detailValue}>{parsed?.experience_min}+ Years</span>
    </div>
    <div style={styles.jdDetailItem}>
      <span style={styles.detailLabel}>LOCATION</span>
      <span style={styles.detailValue}>{parsed?.location || "Remote / Not Specified"}</span>
    </div>
  </div>

  <div style={styles.dividerSmall} />

  <div style={styles.skillHeader}>
    <span style={styles.detailLabel}>TECHNICAL KEYWORDS DETECTED</span>
  </div>
  <div style={styles.skillPills}>
    {parsed?.skills?.map((s: string) => (
      <span key={s} style={styles.pill}>{s}</span>
    ))}
  </div>
<div style={styles.jdSummarySection}>
  <span style={styles.detailLabel}>TARGET PROFILE ANALYSIS</span>
  <div style={styles.summaryContent}>
    <p style={styles.summaryText}>
      {parsed?.ai_summary || `Seeking a ${parsed?.role || 'professional'} with a focus on ${parsed?.skills?.slice(0, 2).join(' & ') || 'core technologies'}. The ideal candidate demonstrates high proficiency in modern development workflows and matches the required ${parsed?.experience_min}+ years of industry expertise.`}
    </p>
    <div style={styles.priorityGrid}>
      <div style={styles.priorityItem}>
        <span style={styles.priorityDot}></span>
        <span>High Priority: {parsed?.skills?.[0] || 'Technical Fit'}</span>
      </div>
      <div style={styles.priorityItem}>
        <span style={{...styles.priorityDot, background: '#eab308'}}></span>
        <span>Secondary: System Architecture</span>
      </div>
    </div>
  </div>
</div>
</div>

        <div style={styles.statBox}>
  <h4 style={styles.cardLabel}>Optimize Match Logic</h4>
  {Object.keys(weights).map((key) => (
    <div key={key} style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
        <span>{key.toUpperCase()} WEIGHT</span>
        <span style={{ color: '#818cf8' }}>{(weights[key] * 100).toFixed(0)}%</span>
      </div>
      <input 
        type="range" min="0" max="1" step="0.05" 
        value={weights[key]} 
        onChange={(e) => setWeights({...weights, [key]: parseFloat(e.target.value)})}
        style={styles.slider}
      />
    </div>
  ))}

  <div style={styles.matchSummary}>
    <div style={styles.summaryItem}>
      <span style={styles.summaryLabel}>TOTAL SCANNED</span>
      <span style={styles.summaryValue}>{dynamicCandidates.length}</span>
    </div>
    <div style={styles.summaryItem}>
      <span style={styles.summaryLabel}>TOP MATCHES</span>
      <span style={{...styles.summaryValue, color: '#4ade80'}}>{shortlist.length}</span>
    </div>
  </div>

  <div style={styles.dividerSmall} />

  <div>
    <span style={styles.detailLabel}>TALENT POOL DISTRIBUTION</span>
    <div style={styles.qualityBar}>
      <div style={{...styles.qualitySegment, width: '20%', background: '#22c55e'}} />
      <div style={{...styles.qualitySegment, width: '55%', background: '#eab308'}} />
      <div style={{...styles.qualitySegment, width: '25%', background: '#ef4444'}} />
    </div>
    <div style={styles.qualityLabels}>
      <span>TOP TIER</span>
      <span>POTENTIAL</span>
      <span>REJECTS</span>
    </div>
  </div>
</div>



      </div>

      {shortlist.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏆 Top Recommendations</h2>
          <div style={styles.grid}>
            {shortlist.map((c: any, i: number) => (
<CandidateCard key={`top-${c.candidate_id || i}`} candidate={{ ...c, rank: i + 1 }} />            ))}
          </div>
        </section>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📋 Full Pipeline</h2>
        <div style={styles.grid}>
{dynamicCandidates.map((c: any, i: number) => (
<CandidateCard key={`all-${c.candidate_id || i}`} candidate={{ ...c, rank: i + 1 }} />))}
        </div>
      </section>
    </div>
  );
  
}


const styles: any = {
  pageWrapper: {
    padding: "40px",
    background: "#0f172a", 
    minHeight: "100vh",
    color: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  title: { fontSize: "28px", fontWeight: "800", margin: 0 },
  subtitle: { color: "#94a3b8", marginTop: "4px" },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "40px",
  },
  parsedCard: {
    background: "rgba(30, 41, 59, 0.5)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #334155",
  },
  cardLabel: { textTransform: "uppercase", fontSize: "12px", color: "#64748b", marginBottom: "12px", letterSpacing: "0.05em" },
  jdMeta: { display: "flex", gap: "20px", marginBottom: "15px" },
  skillPills: { display: "flex", flexWrap: "wrap", gap: "8px" },
  pill: { background: "#334155", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" },
  statBox: {
    background: "rgba(30, 41, 59, 0.5)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #334155",
  },
  statRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" },
  section: { marginBottom: "50px" },
  sectionTitle: { fontSize: "20px", marginBottom: "20px", color: "#cbd5e1" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" },
  backBtn: {
    padding: "10px 20px",
    background: "#334155",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  loadingContainer: { padding: "100px", textAlign: "center", background: "#0f172a", minHeight: "100vh", color: "white" },
  slider: {
  width: "100%",
  height: "4px",
  borderRadius: "5px",
  background: "#334155",
  outline: "none",
  accentColor: "#818cf8", 
  cursor: "pointer",
  marginTop: "8px",
  marginBottom: "4px"
},
jdMainInfo: {
    display: "flex",
    gap: "40px",
    marginBottom: "20px",
    marginTop: "10px",
  },
  jdDetailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "700",
    letterSpacing: "0.05em",
  },
  detailValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f8fafc",
  },
  marketBadge: {
    fontSize: "10px",
    background: "rgba(129, 140, 248, 0.1)",
    color: "#818cf8",
    padding: "4px 10px",
    borderRadius: "20px",
    border: "1px solid rgba(129, 140, 248, 0.2)",
  },
  dividerSmall: {
    height: "1px",
    background: "rgba(255, 255, 255, 0.05)",
    margin: "15px 0",
  },
  skillHeader: {
    marginBottom: "10px",
  },
  qualityBar: {
    height: "10px",
    width: "100%",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "10px",
    display: "flex",
    overflow: "hidden",
    marginTop: "10px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  qualitySegment: {
    height: "100%",
    transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)", 
  },
  matchSummary: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    padding: "10px 0",
  },
  summaryItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  summaryLabel: {
    fontSize: "9px",
    color: "#64748b",
    fontWeight: "800",
  },
  summaryValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
  },
  qualityLabels: {
    display: 'flex', 
    justifyContent: 'space-between', 
    fontSize: '9px', 
    marginTop: '8px', 
    color: '#64748b', 
    fontWeight: 'bold',
    letterSpacing: '0.02em'
  },
  jdSummarySection: {
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  },
  summaryContent: {
    background: "rgba(255, 255, 255, 0.02)",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "10px",
    border: "1px solid rgba(255, 255, 255, 0.03)",
  },
  summaryText: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#cbd5e1",
    margin: "0 0 12px 0",
  },
  priorityGrid: {
    display: "flex",
    gap: "20px",
  },
  priorityItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "600",
  },
  priorityDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22c55e",
  }
};
