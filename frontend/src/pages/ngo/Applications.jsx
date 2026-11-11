// frontend/src/pages/ngo/Applications.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../../api/client";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

export default function NgoApplications() {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get("/applications")
      .then((response) => setApplications(response.data.applications))
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id, status) {
    try {
      await api.patch(`/applications/${id}`, { status });
      toast(`Application ${status}.`, "success");
      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  const rows = filter ? applications.filter((row) => row.status === filter) : applications;

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <h1>Applications</h1>
          <p className="muted">Approve or reject student applications to your programs.</p>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {loading ? (
        <p className="muted">Loading applications...</p>
      ) : rows.length === 0 ? (
        <EmptyState title="Nothing here" message="No applications with this status." />
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Program</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((application) => (
                <tr key={application.id}>
                  <td>{application.student_name}</td>
                  <td>{application.program_title}</td>
                  <td className="small">{application.message || "-"}</td>
                  <td><StatusBadge status={application.status} /></td>
                  <td>
                    {application.status === "pending" ? (
                      <div className="row gap">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => decide(application.id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => decide(application.id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="small muted">Decided</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
