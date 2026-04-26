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
    } catch (error: any) {
      setStatus({ type: "error", message: error.message || "Neural link severed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.viewPort}>
      <div className="scene">
        <div className="mesh-gradient"></div>
        <div className="floating-sphere"></div>
      </div>

      <div style={styles.scrollContainer}>
        <div style={styles.contentBox}>
          <header style={styles.header}>
            <div className="floating-logo" style={styles.logoContainer}>
  <div className="core-glow"></div>
  
  <img 
    src="/my_logo.png" 
    alt="Neural Core"
    style={styles.logoImage}
    className="neural-pulse" 
  />
</div>
            <h1 style={styles.mainTitle}>VOLTRIX</h1>
            <p style={styles.subtitle}>NEURAL CANDIDATE SYNTHESIS ENGINE // VER 2.0.4</p>
          </header>

          <main style={styles.mainStage}>
            {/* 💎 THE GLASS SLAB */}
            <div className="glass-slab">
              <JDInput value={jd} onChange={setJd} />
              
              <div style={styles.actionArea}>
                <button
                  onClick={handleSearch}
                  disabled={loading || !jd.trim()}
                  className="plasma-button"
                >
                  <span className="btn-label">
                    {loading ? "INITIALIZING UPLINK..." : "EXECUTE ANALYSIS"}
                  </span>
                </button>
              </div>

              {status.message && (
                <div className="error-message-box">
                  <div className="error-accent"></div>
                  <span>{status.message}</span>
                </div>
              )}
            </div>
          </main>

          <footer style={styles.footer}>
            <div className="depth-pill">SIGNAL_STABLE</div>
            <div className="depth-pill">ENCRYPTION_ACTIVE</div>
          </footer>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;400;900&family=JetBrains+Mono:wght@300&display=swap');

        body {
          margin: 0;
          background: #000;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          overflow: hidden; 
        }

        /* 3D SCENE SETUP */
        .scene {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          perspective: 1200px;
          z-index: -1;
        }

        .mesh-gradient {
          position: absolute;
          width: 200%; height: 200%;
          top: -50%; left: -50%;
          background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #000 70%);
          opacity: 0.6;
        }

        .floating-sphere {
          position: absolute;
          top: 20%; right: 10%;
          width: 400px; height: 400px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.3;
          animation: orbit 25s infinite linear;
        }

        @keyframes orbit {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-100px, 50px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        /* PROFESSIONAL GLASS SLAB (NON-TILT) */
        .glass-slab {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(25px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          /* Subtle top-edge light to mimic real glass thickness */
          border-top: 1px solid rgba(255, 255, 255, 0.2); 
          border-radius: 32px;
          padding: 60px;
          position: relative;
          box-shadow: 
            0 30px 60px rgba(0,0,0,0.4),
            inset 0 0 0px 1px rgba(255,255,255,0.02);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-slab:hover {
          /* Professional Lift & Depth instead of Tilt */
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 50px 100px rgba(0,0,0,0.6),
            0 0 40px rgba(99, 102, 241, 0.1); /* Soft indigo aura */
        }

        /* PLASMA BUTTON */
        .plasma-button {
          width: 100%;
          padding: 24px;
          background: #fff;
          border-radius: 16px;
          border: none;
          font-weight: 900;
          letter-spacing: 3px;
          color: #000;
          cursor: pointer;
          position: relative;
          transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 0 0px rgba(255,255,255,0);
        }

        .plasma-button:hover:not(:disabled) {
          background: #00f2ff;
          box-shadow: 0 10px 30px rgba(0, 242, 255, 0.3);
          transform: translateY(-2px);
          letter-spacing: 5px; /* Kinetic expansion */
        }

        /* SCROLLABLE ERROR BOX */
        .error-message-box {
          margin-top: 30px;
          padding: 20px;
          background: rgba(255, 59, 48, 0.05);
          border-radius: 12px;
          border-left: 4px solid #ff3b30;
          color: #ff9f0a;
          font-size: 14px;
          font-family: 'JetBrains Mono', monospace;
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .depth-pill {
          background: rgba(255,255,255,0.05);
          padding: 6px 18px;
          border-radius: 100px;
          font-size: 10px;
          letter-spacing: 2px;
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        /* ANIMATIONS */
        .neural-pulse {
          animation: pulse-glow 2.5s ease-in-out infinite alternate;
          user-select: none;
          pointer-events: none;
        }

        @keyframes pulse-glow {
          0% { filter: drop-shadow(0 0 5px rgba(0, 242, 255, 0.3)); transform: scale(1); }
          100% { filter: drop-shadow(0 0 15px rgba(0, 242, 255, 0.7)); transform: scale(1.05); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  viewPort: {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    position: "relative"
  },
  scrollContainer: {
    height: "100%",
    width: "100%",
    overflowY: "auto",
    padding: "80px 20px",
    scrollBehavior: "smooth"
  },
  contentBox: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative"
  },
  header: { textAlign: "center", marginBottom: "60px" },
  logoText: { fontSize: "42px", fontWeight: "900", position: "relative", zIndex: 2 },
  mainTitle: {
    fontSize: "90px",
    fontWeight: "900",
    letterSpacing: "-0.05em",
    margin: "10px 0",
    background: "linear-gradient(to bottom, #fff, #444)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: { color: "#64748b", fontSize: "12px", letterSpacing: "4px" },
  mainStage: { perspective: "1000px" },
  actionArea: { marginTop: "40px" },
  footer: { 
    marginTop: "80px", 
    display: "flex", 
    justifyContent: "center", 
    gap: "15px", 
    opacity: 0.6 
  },
  logoContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "clamp(50px, 7vw, 65px)", 
    height: "clamp(50px, 7vw, 65px)",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.01)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(4px)",
    margin: "0 auto 10px", 
    transition: "all 0.3s ease",
  },
  logoImage: {
    width: "65%", 
    height: "65%",
    objectFit: "contain",
    zIndex: 2,
    filter: "drop-shadow(0 0 8px rgba(0, 242, 255, 0.5))",
    userSelect: "none",
  },
};
