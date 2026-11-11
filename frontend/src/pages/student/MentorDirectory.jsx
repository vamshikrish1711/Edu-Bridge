// frontend/src/pages/student/MentorDirectory.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../../api/client";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

export default function MentorDirectory() {
  const toast = useToast();
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  function load() {
    Promise.all([api.get("/mentors"), api.get("/mentorship/requests")])
      .then(([mentorResponse, requestResponse]) => {
        setMentors(mentorResponse.data.mentors);
        setRequests(requestResponse.data.requests);
      })
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function existing(mentorId) {
    return requests.find(
      (row) => row.mentor_id === mentorId && ["pending", "accepted"].includes(row.status)
    );
  }

  async function requestMentor() {
    if (!selected) return;
    setBusy(true);
    try {
      await api.post("/mentorship/requests", { mentor_id: selected.id, message });
      toast(`Request sent to ${selected.name}.`, "success");
      setSelected(null);
      setMessage("");
      load();
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="muted">Loading mentors...</p>;

  return (
    <div className="stack">
      <div>
        <h1>Mentor directory</h1>
        <p className="muted">Send one request per mentor. They accept or reject it.</p>
      </div>

      {mentors.length === 0 ? (
        <EmptyState title="No mentors available" message="Approved mentors appear here." />
      ) : (
        <div className="grid grid-3">
          {mentors.map((mentor) => {
            const current = existing(mentor.id);
            return (
              <article className="card stack-sm" key={mentor.id}>
                <div className="row between">
                  <h3>{mentor.name}</h3>
                  {current && <StatusBadge status={current.status} />}
                </div>
                <p className="small muted">{mentor.email}</p>
                <p><strong>Expertise:</strong> {mentor.expertise || "Not listed"}</p>
                <p><strong>Availability:</strong> {mentor.availability || "Not listed"}</p>
                {!current && (
                  <button className="btn btn-outline btn-sm" onClick={() => setSelected(mentor)}>
                    Request mentorship
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="card stack">
          <h2>Request {selected.name}</h2>
          <label>
            What do you need help with?
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
          </label>
          <div className="row gap">
            <button className="btn btn-primary" onClick={requestMentor} disabled={busy}>
              {busy ? "Sending..." : "Send request"}
            </button>
            <button className="btn btn-outline" onClick={() => setSelected(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
