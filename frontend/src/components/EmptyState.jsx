// frontend/src/components/EmptyState.jsx
export default function EmptyState({ title, message, action }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {message && <p className="muted">{message}</p>}
      {action}
    </div>
  );
}
