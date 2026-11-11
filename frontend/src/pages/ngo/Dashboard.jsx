// frontend/src/pages/ngo/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../../api/client";
import EmptyState from "../../components/EmptyState";
import { money } from "../../components/ProgramCard";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

export default function NgoDashboard() {
  const toast = useToast();
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [donations, setDonations] = useState({ summary: { total: 0, count: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/programs?mine=1"),
      api.get("/applications"),
      api.get("/donations"),
    ])
      .then(([programResponse, applicationResponse, donationResponse]) => {
        setPrograms(programResponse.data.programs);
        setApplications(applicationResponse.data.applications);
        setDonations(donationResponse.data);
      })
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <p className="muted">Loading dashboard...</p>;

  const raised = programs.reduce((sum, program) => sum + Number(program.raised_amount || 0), 0);
  const target = programs.reduce((sum, program) => sum + Number(program.target_amount || 0), 0);
  const pending = applications.filter((row) => row.status === "pending");
  const percent = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <h1>NGO dashboard</h1>
          <p className="muted">Programs, funds and applications in one view.</p>
        </div>
        <Link className="btn btn-primary" to="/ngo/programs/new">
          Create program
        </Link>
      </div>

      <div className="grid grid-4">
        <div className="card stat">
          <span className="stat-value">{programs.length}</span>
          <span className="stat-label">Programs</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{money(raised)}</span>
          <span className="stat-label">Funds raised</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{pending.length}</span>
          <span className="stat-label">Pending applications</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{donations.summary?.count || 0}</span>
          <span className="stat-label">Donations</span>
        </div>
      </div>

      <section className="card">
        <div className="row between wrap">
          <h2>Funds raised against target</h2>
          <span className="small muted">{percent}% of {money(target)}</span>
        </div>
        <div className="progress">
          <span style={{ width: `${percent}%` }} />
        </div>
      </section>

      <section className="card">
        <h2>Your programs</h2>
        {programs.length === 0 ? (
          <EmptyState
            title="No programs yet"
            message="Create your first program to start receiving applications."
            action={<Link className="text-link" to="/ngo/programs/new">Create program</Link>}
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Raised</th>
                  <th>Target</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id}>
                    <td>{program.title}</td>
                    <td>{program.type}</td>
                    <td><StatusBadge status={program.status} /></td>
                    <td>{money(program.raised_amount)}</td>
                    <td>{money(program.target_amount)}</td>
                    <td>
                      <Link className="text-link" to={`/ngo/programs/${program.id}/edit`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <div className="row between wrap">
          <h2>Pending applications</h2>
          <Link className="text-link" to="/ngo/applications">Review all</Link>
        </div>
        {pending.length === 0 ? (
          <p className="muted">No pending applications.</p>
        ) : (
          <div className="stack-sm">
            {pending.slice(0, 5).map((application) => (
              <div key={application.id} className="list-item">
                <div>
                  <strong>{application.student_name}</strong>
                  <p className="small muted">{application.program_title}</p>
                </div>
                <StatusBadge status={application.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
