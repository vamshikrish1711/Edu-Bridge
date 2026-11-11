// frontend/src/pages/mentor/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../../api/client";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

export default function MentorDashboard() {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    Promise.all([api.get("/mentorship/requests"), api.get("/mentorship/sessions")])
      .then(([requestResponse, sessionResponse]) => {
        setRequests(requestResponse.data.requests);
        setSessions(sessionResponse.data.sessions);
      })
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id, status) {
    try {
      await api.patch(`/mentorship/requests/${id}`, { status });
      toast(`Request ${status}.`, "success");
      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  async function markDone(id) {
    try {
      await api.patch(`/mentorship/sessions/${id}`, { status: "done" });
      toast("Session marked done.", "success");
      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  if (loading) return <p className="muted">Loading dashboard...</p>;

  const pending = requests.filter((row) => row.status === "pending");
  const accepted = requests.filter((row) => row.status === "accepted");
  const scheduled = sessions.filter((row) => row.status === "scheduled");

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <h1>Mentor dashboard</h1>
          <p className="muted">Requests, accepted mentees and sessions.</p>
        </div>
        <Link className="btn btn-primary" to="/mentor/sessions/new">Schedule session</Link>
      </div>

      <div className="grid grid-4">
        <div className="card stat">
          <span className="stat-value">{pending.length}</span>
          <span className="stat-label">Pending requests</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{accepted.length}</span>
          <span className="stat-label">Mentees</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{scheduled.length}</span>
          <span className="stat-label">Scheduled sessions</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{sessions.filter((row) => row.status === "done").length}</span>
          <span className="stat-label">Completed sessions</span>
        </div>
      </div>

      <section className="card">
        <h2>Mentee requests</h2>
        {requests.length === 0 ? (
          <EmptyState title="No requests" message="Students who request you appear here." />
        ) : (
          <div className="stack-sm">
            {requests.map((request) => (
              <div key={request.id} className="list-item">
                <div>
                  <strong>{request.student_name}</strong>
                  <p className="small muted">{request.message || "No message."}</p>
                </div>
                <div className="row gap">
                  <StatusBadge status={request.status} />
                  {request.status === "pending" && (
                    <>
                      <button className="btn btn-sm btn-primary" onClick={() => decide(request.id, "accepted")}>
                        Accept
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => decide(request.id, "rejected")}>
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Sessions</h2>
        {sessions.length === 0 ? (
          <EmptyState title="No sessions" message="Schedule one with an accepted mentee." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>When</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.student_name}</td>
                    <td>{new Date(session.scheduled_at).toLocaleString("en-IN")}</td>
                    <td>{session.mode}</td>
                    <td><StatusBadge status={session.status} /></td>
                    <td>
                      {session.status === "scheduled" ? (
                        <button className="btn btn-sm btn-outline" onClick={() => markDone(session.id)}>
                          Mark done
                        </button>
                      ) : (
                        <span className="small muted">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
