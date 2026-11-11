// frontend/src/components/StatusBadge.jsx
export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status || "neutral"}`}>{status || "unknown"}</span>;
}
