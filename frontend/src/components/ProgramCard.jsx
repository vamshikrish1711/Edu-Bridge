// frontend/src/components/ProgramCard.jsx
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export function money(value) {
  return `INR ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function ProgramCard({ program }) {
  const target = Number(program.target_amount || 0);
  const raised = Number(program.raised_amount || 0);
  const percent = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

  return (
    <article className="card program-card">
      <div className="row between">
        <span className="pill">{program.type}</span>
        <StatusBadge status={program.status} />
      </div>
      <h3>
        <Link to={`/programs/${program.id}`}>{program.title}</Link>
      </h3>
      <p className="muted small">{program.ngo_name}</p>
      <p className="clamp-3">{program.description}</p>
      {target > 0 ? (
        <div className="progress-block">
          <div className="progress">
            <span style={{ width: `${percent}%` }} />
          </div>
          <p className="small muted">
            {money(raised)} raised of {money(target)} ({percent}%)
          </p>
        </div>
      ) : (
        <p className="small muted">
          {program.volunteer_slots || 0} volunteer slots
        </p>
      )}
      <Link className="text-link" to={`/programs/${program.id}`}>
        View details
      </Link>
    </article>
  );
}
