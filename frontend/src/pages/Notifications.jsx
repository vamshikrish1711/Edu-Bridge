// frontend/src/pages/Notifications.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../api/client";
import EmptyState from "../components/EmptyState";
import { useToast } from "../components/Toast";

export default function Notifications() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  function load() {
    api
      .get("/notifications")
      .then((response) => {
        setItems(response.data.notifications);
        setUnread(response.data.unread_count);
      })
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  async function readAll() {
    try {
      await api.post("/notifications/read-all");
      load();
      toast("All notifications marked read.", "success");
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <h1>Notifications</h1>
          <p className="muted">{unread} unread</p>
        </div>
        <button className="btn btn-outline" onClick={readAll} disabled={!unread}>
          Mark all read
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading notifications...</p>
      ) : items.length === 0 ? (
        <EmptyState title="No notifications" message="Approvals, donations and sessions show up here." />
      ) : (
        <div className="stack-sm">
          {items.map((item) => (
            <article
              key={item.id}
              className={`card notification-item ${item.is_read ? "" : "unread"}`}
            >
              <div className="row between wrap gap">
                <strong>{item.title}</strong>
                <span className="small muted">
                  {new Date(item.created_at).toLocaleString("en-IN")}
                </span>
              </div>
              <p>{item.message}</p>
              {!item.is_read && (
                <button className="btn btn-sm btn-outline" onClick={() => markRead(item.id)}>
                  Mark read
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
