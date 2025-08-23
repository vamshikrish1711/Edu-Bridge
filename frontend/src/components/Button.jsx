export default function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
}