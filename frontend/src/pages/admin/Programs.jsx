// frontend/src/pages/admin/Programs.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../../api/client";
import { money } from "../../components/ProgramCard";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

export default function AdminPrograms() {
  const toast = useToast();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/programs")
      .then((response) => setPrograms(response.data.programs))
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <p className="muted">Loading programs...</p>;

  return (
    <div className="stack">
      <div>
        <h1>All programs</h1>
        <p className="muted">Every program across approved NGOs.</p>
      </div>
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>NGO</th>
              <th>Type</th>
              <th>Status</th>
              <th>Raised</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td>
                  <Link to={`/programs/${program.id}`}>{program.title}</Link>
                </td>
                <td>{program.ngo_name}</td>
                <td>{program.type}</td>
                <td><StatusBadge status={program.status} /></td>
                <td>{money(program.raised_amount)}</td>
                <td>{money(program.target_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
