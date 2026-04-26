export default function JDInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div style={styles.inputContainer}>
      <div style={styles.labelRow}>
        <label style={styles.hudLabel}>TARGET_DATA_STREAM</label>
        <span style={styles.statusDot}>LIVE_BUFFER</span>
      </div>
      
      <textarea
        rows={10}
        placeholder="AWAITING_INPUT: Paste Job Description for vector mapping..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tactical-input"
      />
      
      <div style={styles.charCount}>
        METRICS: <span style={{ color: '#00f2ff' }}>{value.length.toLocaleString()}</span>_BYTES_PROCESSED
      </div>

      <style jsx>{`
        .tactical-input {
          width: 100%;
          box-sizing: border-box;
          padding: 20px;
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 14px;
          line-height: 1.7;
          font-family: 'JetBrains Mono', monospace;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          resize: vertical;
        }
        .tactical-input:focus {
          border-color: #00f2ff;
          background: rgba(0, 0, 0, 0.6);
          box-shadow: 0 0 20px rgba(0, 242, 255, 0.1), inset 0 0 10px rgba(0, 242, 255, 0.05);
        }
        .tactical-input::placeholder {
          color: #334155;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  inputContainer: { display: "flex", flexDirection: "column", gap: "12px", width: "100%" },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  hudLabel: { fontSize: "10px", fontWeight: "900", color: "#475569", letterSpacing: "3px" },
  statusDot: { fontSize: '9px', color: '#00ff00', fontFamily: 'JetBrains Mono', border: '1px solid #00ff00', padding: '2px 8px', borderRadius: '4px' },
  charCount: { fontSize: "9px", color: "#475569", textAlign: "right", fontFamily: 'JetBrains Mono', marginTop: '8px' },
};
