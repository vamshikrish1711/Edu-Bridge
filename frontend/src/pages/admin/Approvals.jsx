// frontend/src/pages/admin/Approvals.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../../api/client";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../components/Toast";

export default function Approvals() {
  const toast = useToast();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api
      .get("/admin/pending")
      .then((response) => setPending(response.data.pending))
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id, action) {
    try {
      await api.patch(`/admin/pending/${id}`, { action });
      toast(`Account ${action}d.`, "success");
      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  if (loading) return <p className="muted">Loading approvals...</p>;

  return (
    <div className="stack">
      <div>
        <h1>Approvals queue</h1>
        <p className="muted">NGOs and mentors stay pending until you approve them.</p>
      </div>
      {pending.length === 0 ? (
        <EmptyState title="Queue is clear" message="No pending NGO or mentor accounts." />
      ) : (
        <div className="stack-sm">
          {pending.map((account) => (
            <article className="card" key={account.id}>
              <div className="row between wrap gap">
                <div>
                  <h3>{account.name}</h3>
                  <p className="small muted">
                    {account.role.toUpperCase()} · {account.email} · {account.phone || "No phone"}
                  </p>
                </div>
                <div className="row gap">
                  <button className="btn btn-primary btn-sm" onClick={() => decide(account.id, "approve")}>
                    Approve
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => decide(account.id, "reject")}>
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
