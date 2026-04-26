export default function ScoreBadge({ label, value }: { label: string; value: number }) {
  const getStatusConfig = (val: number) => {
    if (val >= 0.75) return { bg: "#DCFCE7", text: "#166534", dot: "#22C55E", label: "High" };
    if (val >= 0.5) return { bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308", label: "Med" };
    return { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444", label: "Low" };
  };

  const config = getStatusConfig(value);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "12px", 
        background: config.bg,
        color: config.text,
        fontSize: "11px",
        fontWeight: "600",
        fontFamily: "Inter, system-ui, sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.025em",
        border: `1px solid rgba(0,0,0,0.05)`
      }}
    >
      <span style={{ height: "6px", width: "6px", borderRadius: "50%", background: config.dot }} />
      <span>{label}: {value.toFixed(2)}</span>
    </div>
  );
}
