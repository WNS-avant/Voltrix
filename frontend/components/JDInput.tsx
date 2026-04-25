export default function JDInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", boxSizing: "border-box" }}>
      <label style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Target Job Description
      </label>
      
      <textarea
        rows={10}
        placeholder="Paste JD to analyze semantic match and skill alignment..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box", // 👈 Crucial: prevents padding from causing overflow
          padding: "16px",
          borderRadius: "12px",
          background: "rgba(15, 23, 42, 0.6)", // Darker translucent background
          border: "1px solid #334155",
          color: "#f8fafc", // High contrast off-white text
          fontSize: "14px",
          lineHeight: "1.6",
          fontFamily: "inherit",
          outline: "none",
          transition: "all 0.2s ease",
          boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
          resize: "vertical",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#6366f1";
          e.target.style.background = "rgba(15, 23, 42, 0.8)";
          e.target.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#334155";
          e.target.style.background = "rgba(15, 23, 42, 0.6)";
          e.target.style.boxShadow = "none";
        }}
      />
      
      <div style={{ fontSize: "11px", color: "#64748b", textAlign: "right" }}>
        {value.length.toLocaleString()} characters entered
      </div>
    </div>
  );
}