// frontend/src/components/NotificationBell.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return undefined;
    let active = true;

    function load() {
      api
        .get("/notifications")
        .then((response) => {
          if (active) setUnread(response.data.unread_count || 0);
        })
        .catch(() => {});
    }

    load();
    const timer = window.setInterval(load, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [user]);

  if (!user) return null;

  return (
    <Link className="bell" to="/notifications" aria-label="Notifications">
      Bell
      {unread > 0 && <span className="bell-count">{unread > 9 ? "9+" : unread}</span>}
    </Link>
  );
}
