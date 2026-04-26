import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CandidateCard from "../components/CandidateCard";
import ChatPanel from "../components/ChatPanel";

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
        <div className="pulse-loader"></div>
        <p style={{ letterSpacing: '4px', marginTop: '20px' }}>LINK_DEGRADED: NO_INTEL_FOUND</p>
        <button onClick={() => router.push("/")} style={styles.backBtn}>RE-INITIALIZE</button>
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
    (c: any) => c.final_score > 0.7
  );

  return (
    <div style={styles.pageWrapper}>
      <div className="scene-bg">
        <div className="nebula-cloud"></div>
        <div className="nebula-cloud-alt"></div>
      </div>

      <div style={styles.scrollContainer}>
        <header style={styles.header}>
  <div>
    <h1 style={styles.title}>INTELLIGENCE_DASHBOARD</h1>
    <p style={styles.subtitle}>NEURAL_MATCHMAKING // SIMULATED_INTENT</p>
  </div>
  
  <button 
    onClick={() => router.push("/")} 
    className="new-scan-trigger"
    style={styles.newScanBtn}
  >
    <span className="btn-bracket">[</span>
    <span className="btn-text">NEW_SCAN</span>
    <span className="btn-bracket">]</span>
  </button>
</header>

        <div style={styles.topFlexRow}>
          
          <div className="glass-slab" style={styles.leftSlab}>
            <div style={styles.slabHeader}>
              <h4 style={styles.cardLabel}>PARSED_CORE_VECTORS</h4>
              <span className="live-market-badge">LIVE_MARKET_DATA</span>
            </div>

            <div style={styles.jdMainGrid}>
              <div style={styles.jdDetailItem}>
                <span style={styles.detailLabel}>TARGET ROLE</span>
                <span style={styles.detailValue}>{parsed?.role || "Machine Learning Engineer"}</span>
              </div>
              <div style={styles.jdDetailItem}>
  <span style={styles.detailLabel}>EXP_REQUIRED</span>
  <span style={styles.detailValue}>
    {parsed?.experience_min < 1 
      ? `${parsed.experience_min * 12} MONTHS` 
      : `${parsed?.experience_min}+ YRS`}
  </span>
</div>
              <div style={styles.jdDetailItem}>
                <span style={styles.detailLabel}>LOCATION</span>
                <span style={styles.detailValue}>{parsed?.location || "Remote"}</span>
              </div>
            </div>

            <div style={styles.skillPills}>
              {(parsed?.skills || []).map((s: string) => (
                <span key={s} className="pill-neon">{s}</span>
              ))}
            </div>

            <div style={styles.jdSummarySection}>
              <span style={styles.detailLabel}>TARGET PROFILE ANALYSIS</span>
              <div className="summary-glass">
                <p style={styles.summaryText}>{parsed?.ai_summary || "Automated vector analysis of role requirements complete."}</p>
                <div style={styles.priorityGrid}>
                  <div style={styles.priorityItem}>
                    <span className="dot green"></span> 
                    <span>High Priority: {parsed?.skills?.[0] || 'Technical Fit'}</span>
                  </div>
                  <div style={styles.priorityItem}>
                    <span className="dot yellow"></span> 
                    <span>Secondary: System Architecture</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-slab" style={styles.rightSlab}>
            <h4 style={styles.cardLabel}>OPTIMIZE_MATCH_LOGIC</h4>
            {Object.keys(weights).map((key) => (
              <div key={key} style={{ marginBottom: '15px' }}>
                <div style={styles.sliderLabel}>
                  <span>{key.toUpperCase()}_WEIGHT</span>
                  <span className="cyan-text">{(weights[key as keyof typeof weights] * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={weights[key as keyof typeof weights]} 
                  onChange={(e) => setWeights({...weights, [key]: parseFloat(e.target.value)})}
                  className="custom-slider"
                />
              </div>
            ))}
            
            <div style={styles.matchSummary}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>TOTAL_SCANNED</span>
                <span style={styles.summaryValue}>{dynamicCandidates.length}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>TOP_MATCHES</span>
                <span className="match-count-glow">{shortlist.length}</span>
              </div>
            </div>

            <div style={styles.dividerSmall} />
            <span style={styles.detailLabel}>TALENT_POOL_DISTRIBUTION</span>
            <div style={styles.qualityBar}>
              <div style={{...styles.qualitySegment, width: '20%', background: '#00ff00', boxShadow: '0 0 10px #00ff00'}} />
              <div style={{...styles.qualitySegment, width: '55%', background: '#eab308'}} />
              <div style={{...styles.qualitySegment, width: '25%', background: '#ff3b30'}} />
            </div>
            <div style={styles.qualityLabels}>
              <span>TOP_TIER</span>
              <span>POTENTIAL</span>
              <span>REJECTS</span>
            </div>
          </div>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>// TOP_RECOMMENDATIONS</h2>
          <div style={styles.grid}>
            {shortlist.map((c: any, i: number) => (
              <div className="card-perspective" key={`top-${i}`}>
                 <CandidateCard candidate={{ ...c, rank: i + 1 }} />
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>// FULL_PIPELINE_OUTPUT</h2>
          <div style={styles.grid}>
            {dynamicCandidates.map((c: any, i: number) => (
               <div className="card-perspective" key={`all-${i}`}>
                  <CandidateCard candidate={{ ...c, rank: i + 1 }} />
               </div>
            ))}
          </div>
        </section>

        <div style={styles.dividerLarge} />

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>// INTENT_DECODER_TERMINAL</h2>
          <div style={styles.chatTerminalWrapper}>
             <ChatPanel />
          </div>
        </section>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;400;900&family=JetBrains+Mono:wght@300&display=swap');
        * { box-sizing: border-box; }
        body { background: #010208; color: #fff; font-family: 'Outfit', sans-serif; margin: 0; overflow: hidden; }
        .scene-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 50% 50%, #0a0a1a 0%, #000 100%); }
        .glass-slab { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px) saturate(150%); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 28px; padding: 35px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .pill-neon { background: rgba(0, 242, 255, 0.05); color: #00f2ff; border: 1px solid rgba(0, 242, 255, 0.2); padding: 5px 12px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; margin-right: 8px; margin-bottom: 8px; display: inline-block; }
        .custom-slider { -webkit-appearance: none; width: 100%; background: rgba(255,255,255,0.1); height: 2px; outline: none; margin: 10px 0; }
        .custom-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: #00f2ff; border-radius: 50%; box-shadow: 0 0 12px #00f2ff; cursor: pointer; }
        .match-count-glow { color: #00ff00; font-size: 24px; font-weight: 900; text-shadow: 0 0 15px rgba(0, 255, 0, 0.5); }
        .cyan-text { color: #00f2ff; font-family: 'JetBrains Mono'; }
        .live-market-badge { font-size: 9px; color: #00ff00; border: 1px solid rgba(0, 255, 0, 0.4); padding: 3px 10px; border-radius: 4px; font-family: 'JetBrains Mono'; letter-spacing: 1px; }
        .summary-glass { background: rgba(255, 255, 255, 0.03); border-radius: 16px; padding: 18px; margin-top: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 10px; }
        .green { background: #00ff00; box-shadow: 0 0 10px #00ff00; }
        .yellow { background: #eab308; }
        .new-scan-hover:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1) !important;
}

/* Hover & Interaction */
.new-scan-trigger {
  position: relative;
  overflow: hidden;
}

.new-scan-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #00f2ff; /* Cyan glow on hover */
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.2);
}

.new-scan-trigger:hover .btn-text {
  color: #00f2ff;
  text-shadow: 0 0 8px rgba(0, 242, 255, 0.5);
}

.new-scan-trigger:active {
  transform: scale(0.95);
}

.btn-bracket {
  color: #475569;
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  transition: color 0.3s;
}

.new-scan-trigger:hover .btn-bracket {
  color: #fff;
}

/* RESPONSIVE FIXES */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .new-scan-trigger {
    width: 100%; /* Button becomes full width on mobile */
    justify-content: center;
    padding: 15px;
  }
  
  h1 {
    font-size: 28px !important;
  }
}
      `}</style>
    </div>
  );
}

const styles: any = {
  pageWrapper: { height: "100vh", width: "100vw", overflow: "hidden", position: "relative" },
  scrollContainer: { height: "100%", width: "100%", overflowY: "auto", padding: "60px 50px", scrollBehavior: "smooth" },
  title: { fontSize: "42px", fontWeight: "900", letterSpacing: "-2px", margin: 0 },
  subtitle: { fontSize: "10px", letterSpacing: "5px", color: "#475569", marginTop: "10px" },
  topFlexRow: { display: "flex", gap: "30px", width: "100%", marginBottom: "60px", alignItems: "stretch", flexWrap: "wrap" },
  leftSlab: { flex: "1.7 1 0", minWidth: "500px" },
  rightSlab: { flex: "1 1 0", minWidth: "350px" },
  slabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  cardLabel: { fontSize: "11px", letterSpacing: "3px", color: "#475569", fontWeight: "900" },
  jdMainGrid: { display: "flex", flexWrap: "wrap", gap: "50px", marginBottom: "25px" },
  jdDetailItem: { display: "flex", flexDirection: "column", gap: "4px" },
  detailLabel: { fontSize: "10px", color: "#475569", fontWeight: "bold", letterSpacing: "1px" },
  detailValue: { fontSize: "22px", fontWeight: "900", color: "#fff" },
  jdSummarySection: { marginTop: "25px" },
  summaryText: { fontSize: "14px", lineHeight: "1.6", color: "#94a3b8", margin: 0 },
  priorityGrid: { display: "flex", gap: "30px", marginTop: "15px" },
  priorityItem: { fontSize: "11px", color: "#fff", display: "flex", alignItems: "center" },
  qualityBar: { height: "6px", width: "100%", display: "flex", overflow: "hidden", marginTop: "20px", borderRadius: "10px" },
  qualitySegment: { height: "100%" },
  qualityLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '12px', color: '#475569', fontWeight: 'bold' },
  dividerSmall: { height: "1px", background: "rgba(255,255,255,0.06)", margin: "25px 0" },
  dividerLarge: { height: "1px", background: "rgba(255,255,255,0.1)", margin: "80px 0" },
  skillPills: { display: "flex", flexWrap: "wrap", marginTop: "10px" },
  sliderLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' },
  matchSummary: { display: "flex", justifyContent: "space-between", margin: "30px 0" },
  summaryItem: { display: "flex", flexDirection: "column", gap: "4px" },
  summaryLabel: { fontSize: "10px", color: "#475569", fontWeight: "900" },
  summaryValue: { fontSize: "24px", fontWeight: "900" },
  section: { marginBottom: "80px" },
  sectionTitle: { fontSize: "16px", letterSpacing: "8px", color: "#334155", marginBottom: "40px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "30px" },
  chatTerminalWrapper: { maxWidth: "1000px", margin: "0 auto" },
  backBtn: { background: "rgba(255,255,255,0.03)", border: "1px solid #334155", color: "#fff", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#010208", color: "#fff" },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "50px",
    flexWrap: "wrap", 
    gap: "20px"
  },
  newScanBtn: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "2px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    height: "fit-content"
  },
};
