// frontend/src/pages/ProgramDetail.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { apiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { money } from "../components/ProgramCard";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/Toast";

export default function ProgramDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [program, setProgram] = useState(null);
  const [application, setApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get(`/programs/${id}`)
      .then((response) => setProgram(response.data.program))
      .catch((err) => setError(apiError(err)));

    if (user?.role === "student") {
      api
        .get("/applications")
        .then((response) => {
          setApplication(
            response.data.applications.find((row) => row.program_id === Number(id)) || null
          );
        })
        .catch(() => {});
    }
  }, [id, user]);

  async function apply() {
    setBusy(true);
    setError("");
    try {
      const response = await api.post(`/programs/${id}/apply`, { message });
      setApplication(response.data.application);
      toast("Application sent. The NGO will review it.", "success");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  if (!program) {
    return error ? <div className="alert alert-error">{error}</div> : <p className="muted">Loading program...</p>;
  }

  const target = Number(program.target_amount || 0);
  const raised = Number(program.raised_amount || 0);
  const percent = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

  return (
    <div className="stack">
      <Link className="text-link" to="/programs">
        Back to programs
      </Link>
      <div className="card stack">
        <div className="row between wrap gap">
          <div>
            <span className="pill">{program.type}</span>
            <h1>{program.title}</h1>
            <p className="muted">By {program.ngo_name}</p>
          </div>
          <StatusBadge status={program.status} />
        </div>

        <p>{program.description}</p>
        <div className="grid grid-2">
          <div>
            <p className="small muted">Dates</p>
            <p>
              {program.start_date || "Not set"} to {program.end_date || "Not set"}
            </p>
          </div>
          <div>
            <p className="small muted">Volunteer slots</p>
            <p>{program.volunteer_slots || 0}</p>
          </div>
        </div>

        {target > 0 && (
          <div className="progress-block">
            <div className="progress">
              <span style={{ width: `${percent}%` }} />
            </div>
            <p className="small muted">
              {money(raised)} raised of {money(target)} ({percent}%). {program.application_count || 0} applications.
            </p>
          </div>
        )}

        {user?.role === "student" && (
          <div className="stack-sm">
            {application ? (
              <div className="alert alert-info">
                Your application is {application.status}.
              </div>
            ) : program.status === "completed" ? (
              <p className="muted">This program is closed.</p>
            ) : (
              <>
                <label>
                  Message to the NGO (optional)
                  <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
                </label>
                <button className="btn btn-primary" onClick={apply} disabled={busy}>
                  {busy ? "Sending..." : "Apply to this program"}
                </button>
              </>
            )}
          </div>
        )}

        {user?.role === "donor" && target > 0 && (
          <Link className="btn btn-primary" to={`/donor/donate?program=${program.id}`}>
            Donate to this program
          </Link>
        )}

        {user?.role === "ngo" && user.id === program.ngo_id && (
          <Link className="btn btn-outline" to={`/ngo/programs/${program.id}/edit`}>
            Edit program
          </Link>
        )}

        {!user && (
          <p className="muted">
            <Link to="/login">Log in</Link> as a student to apply or as a donor to give.
          </p>
        )}
        {error && <div className="alert alert-error">{error}</div>}
      </div>
    </div>
  );
}
