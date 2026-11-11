// frontend/src/pages/student/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../../api/client";
import EmptyState from "../../components/EmptyState";
import ProgramCard from "../../components/ProgramCard";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

export default function StudentDashboard() {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/applications"),
      api.get("/mentorship/requests"),
      api.get("/mentorship/sessions"),
      api.get("/programs?status=active"),
      api.get("/profile"),
    ])
      .then(([apps, reqs, sess, progs, me]) => {
        setApplications(apps.data.applications);
        setRequests(reqs.data.requests);
        setSessions(sess.data.sessions);
        setPrograms(progs.data.programs);
        setProfile(me.data.profile || {});
      })
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const accepted = requests.find((row) => row.status === "accepted");
  const upcoming = sessions.filter(
    (row) => row.status === "scheduled" && new Date(row.scheduled_at) >= new Date()
  );
  const approvedCount = applications.filter((row) => row.status === "approved").length;

  const words = String(profile.interests || "")
    .toLowerCase()
    .split(/[,\s]+/)
    .filter((word) => word.length > 3);
  const matched = programs.filter((program) =>
    words.some(
      (word) =>
        program.title.toLowerCase().includes(word) ||
        program.description.toLowerCase().includes(word)
    )
  );
  const recommended = (matched.length ? matched : programs).slice(0, 3);

  if (loading) return <p className="muted">Loading dashboard...</p>;

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <h1>Student dashboard</h1>
          <p className="muted">Applications, mentor and upcoming sessions.</p>
        </div>
        <Link className="btn btn-outline" to="/student/mentors">
          Find a mentor
        </Link>
      </div>

      <div className="grid grid-4">
        <div className="card stat">
          <span className="stat-value">{applications.length}</span>
          <span className="stat-label">Applications</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{approvedCount}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{accepted ? accepted.mentor_name : "None"}</span>
          <span className="stat-label">Mentor</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{upcoming.length}</span>
          <span className="stat-label">Upcoming sessions</span>
        </div>
      </div>

      <section className="card">
        <h2>Your applications</h2>
        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            message="Browse active programs and apply."
            action={<Link className="text-link" to="/programs">Browse programs</Link>}
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link to={`/programs/${row.program_id}`}>{row.program_title}</Link>
                    </td>
                    <td>{row.program_type}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td>{new Date(row.created_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Upcoming sessions</h2>
        {upcoming.length === 0 ? (
          <p className="muted">No scheduled sessions. An accepted mentor can book one.</p>
        ) : (
          <div className="stack-sm">
            {upcoming.map((session) => (
              <div key={session.id} className="list-item">
                <div>
                  <strong>{session.mentor_name}</strong>
                  <p className="small muted">
                    {new Date(session.scheduled_at).toLocaleString("en-IN")} · {session.mode}
                  </p>
                </div>
                {session.link && (
                  <a className="text-link" href={session.link} target="_blank" rel="noreferrer">
                    Join
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Recommended programs</h2>
            <p className="muted">Active programs matching your interests, newest first.</p>
          </div>
        </div>
        <div className="grid grid-3">
          {recommended.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>
    </div>
  );
}
