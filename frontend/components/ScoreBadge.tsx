export default function ScoreBadge({ label, value }: { label: string; value: number }) {
  const getStatusConfig = (val: number) => {
    if (val >= 0.75) return { border: "#00ff00", glow: "rgba(0, 255, 0, 0.2)", label: "OPTIMAL" };
    if (val >= 0.5) return { border: "#eab308", glow: "rgba(234, 179, 8, 0.2)", label: "STABLE" };
    return { border: "#ef4444", glow: "rgba(239, 68, 68, 0.2)", label: "DEGRADED" };
  };

  const config = getStatusConfig(value);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 12px",
        borderRadius: "4px",
        background: "rgba(0, 0, 0, 0.3)",
        color: config.border,
        fontSize: "10px",
        fontWeight: "900",
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: "uppercase",
        letterSpacing: "1px",
        border: `1px solid ${config.border}`,
        boxShadow: `inset 0 0 8px ${config.glow}`,
      }}
    >
      <span style={{ 
        height: "5px", 
        width: "5px", 
        background: config.border, 
        boxShadow: `0 0 6px ${config.border}` 
      }} />
      <span>{label.replace('_', ' ')}: {(value * 100).toFixed(0)}%</span>
      <span style={{ opacity: 0.4, marginLeft: '4px' }}>[{config.label}]</span>
    </div>
  );
}
