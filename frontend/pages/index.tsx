import { useState } from "react";
import { useRouter } from "next/router";
import { matchCandidates } from "../services/api";
import JDInput from "../components/JDInput";

export default function Home() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); 
  const router = useRouter();

const handleSearch = async () => {
  setLoading(true);
  setStatus({ type: "", message: "" }); 
  
  try {
    const resultsData = await matchCandidates(jd);
    localStorage.setItem("results", JSON.stringify(resultsData));
    router.push("/results");
} catch (error) {
  console.error("Bouncer Blocked:", error);
  
  const serverMessage = error.message || "Please provide a valid Job Description.";
  
  if (error.status === 429) {
    setStatus({
      type: "jargon", 
      message: "🚀 You chewed through the tokens! Chill for a while (about 10 mins) and let the API breathe."
    });
    return; 
  }

  const isSeeker = serverMessage.toLowerCase().includes("seeker");

  setStatus({ 
    type: isSeeker ? "seeker" : "jargon", 
    message: isSeeker 
      ? "🚫 Identity Mismatch: This is for Recruiters. Please enter a Job Description, not a personal bio." 
      : `⚠️ Scan Failed: ${serverMessage}`
  });
} finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <header style={styles.header}>
          <div style={styles.logoIcon}>🎯</div>
          <h1 style={styles.title}>Voltrix</h1>
          <p style={styles.subtitle}>
            Enter a Job Description to rank candidates by skill, experience, and simulated interest.
          </p>
        </header>

        <div style={styles.inputWrapper}>
          <JDInput value={jd} onChange={setJd} />
          
          <button
            onClick={handleSearch}
            disabled={loading || !jd.trim()}
            style={{
              ...styles.searchBtn,
              opacity: loading || !jd.trim() ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? (
              <span style={styles.loaderText}>🚀 Processing Intelligence...</span>
            ) : (
              "Analyze & Match Candidates"
            )}
          </button>
          {status.message && (
            <div style={{
              ...styles.statusBox,
              borderColor: status.type === "seeker" ? "#f87171" : "#fbbf24",
              color: status.type === "seeker" ? "#fca5a5" : "#fde047"
            }}>
              <span>{status.type === "seeker" ? "👤" : "❓"}</span>
              <p>{status.message}</p>
            </div>
          )}
        </div>
          
       
        <div style={styles.footerInfo}>
          <div style={styles.infoCard}>
            <span>🔍</span>
            <p>Semantic Vector Matching</p>
          </div>
          <div style={styles.infoCard}>
            <span>⚖️</span>
            <p>Bias-Free Evaluation</p>
          </div>
          <div style={styles.infoCard}>
            <span>💬</span>
            <p>Interest Simulation</p>
          </div>
        </div>

        {loading && (
          <div style={styles.overlay}>
            <div style={styles.spinner} />
            <p style={{ marginTop: "15px", fontWeight: "600" }}>
              Synthesizing candidate data...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
    color: "#f8fafc"
  },
  contentBox: {
    width: "100%",
    maxWidth: "850px",
    textAlign: "center"
  },
  header: {
    marginBottom: "40px"
  },
  logoIcon: {
    fontSize: "48px",
    marginBottom: "10px"
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    letterSpacing: "-0.02em",
    margin: "0 0 10px 0",
    background: "linear-gradient(90deg, #818cf8, #c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    fontSize: "16px",
    color: "#94a3b8",
    maxWidth: "500px",
    margin: "0 auto"
  },
  inputWrapper: {
    background: "rgba(30, 41, 59, 0.5)",
    padding: "30px",
    borderRadius: "16px",
    border: "1px solid #334155",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
  },
  statusBox: {
  marginTop: "20px",
  padding: "15px",
  background: "rgba(220, 38, 38, 0.1)", 
  borderRadius: "8px",
  border: "1px solid",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "14px",
  textAlign: "left",
  animation: "fadeIn 0.3s ease-in"
},
  searchBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "16px",
    background: "#6366f1",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    transition: "all 0.2s ease"
  },
  footerInfo: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "40px"
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#64748b"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.9)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(99, 102, 241, 0.3)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};
