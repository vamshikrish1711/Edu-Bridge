// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { ROLE_HOME, useAuth } from "../auth/AuthContext";
import NotificationBell from "./NotificationBell";

const LINKS = {
  student: [
    ["/student", "Dashboard"],
    ["/student/mentors", "Mentors"],
    ["/student/donations", "Donations"],
  ],
  ngo: [
    ["/ngo", "Dashboard"],
    ["/ngo/programs/new", "New program"],
    ["/ngo/applications", "Applications"],
    ["/ngo/resources", "Upload resource"],
  ],
  donor: [
    ["/donor", "Dashboard"],
    ["/donor/donate", "Donate"],
    ["/donor/receipts", "Receipts"],
  ],
  mentor: [
    ["/mentor", "Dashboard"],
    ["/mentor/sessions/new", "Schedule"],
    ["/mentor/resources", "Upload resource"],
  ],
  admin: [
    ["/admin/approvals", "Approvals"],
    ["/admin/users", "Users"],
    ["/admin/programs", "Programs"],
    ["/admin/donations", "Donations"],
    ["/admin/analytics", "Analytics"],
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link className="brand" to="/">
          Edu-Bridge
        </Link>
        <nav className="nav-links">
          <Link to="/programs">Programs</Link>
          <Link to="/resources">Resources</Link>
          {user &&
            (LINKS[user.role] || []).map(([path, label]) => (
              <Link key={path} to={path}>
                {label}
              </Link>
            ))}
          {user && <Link to="/profile">Profile</Link>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <NotificationBell />
              <Link className="nav-user" to={ROLE_HOME[user.role] || "/"}>
                {user.name}
              </Link>
              <button className="btn btn-sm btn-outline" onClick={signOut}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-outline" to="/login">
                Log in
              </Link>
              <Link className="btn btn-sm btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
