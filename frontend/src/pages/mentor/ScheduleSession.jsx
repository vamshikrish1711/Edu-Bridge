// frontend/src/pages/mentor/ScheduleSession.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { apiError } from "../../api/client";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

export default function ScheduleSession() {
  const navigate = useNavigate();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    request_id: "",
    scheduled_at: "",
    mode: "online",
    location: "",
    link: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/mentorship/requests")
      .then((response) => {
        const accepted = response.data.requests.filter((row) => row.status === "accepted");
        setRequests(accepted);
        if (accepted.length) {
          setForm((current) => ({ ...current, request_id: String(accepted[0].id) }));
        }
      })
      .catch((err) => setError(apiError(err)));
  }, []);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/mentorship/sessions", {
        ...form,
        request_id: Number(form.request_id),
      });
      toast("Session scheduled.", "success");
      navigate("/mentor");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <Link className="text-link" to="/mentor">Back to dashboard</Link>
      <h1>Schedule session</h1>
      {requests.length === 0 ? (
        <EmptyState
          title="No accepted mentees"
          message="Accept a mentorship request first."
        />
      ) : (
        <form className="card stack" onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}
          <label>
            Mentee
            <select name="request_id" value={form.request_id} onChange={change} required>
              {requests.map((request) => (
                <option key={request.id} value={request.id}>
                  {request.student_name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-2">
            <label>
              Date and time
              <input
                name="scheduled_at"
                type="datetime-local"
                value={form.scheduled_at}
                onChange={change}
                required
              />
            </label>
            <label>
              Mode
              <select name="mode" value={form.mode} onChange={change}>
                <option value="online">Online</option>
                <option value="in_person">In person</option>
              </select>
            </label>
          </div>
          {form.mode === "online" ? (
            <label>
              Meeting link
              <input name="link" value={form.link} onChange={change} placeholder="https://" />
            </label>
          ) : (
            <label>
              Location
              <input name="location" value={form.location} onChange={change} />
            </label>
          )}
          <label>
            Notes
            <textarea name="notes" value={form.notes} onChange={change} />
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Scheduling..." : "Schedule session"}
          </button>
        </form>
      )}
    </div>
  );
}
