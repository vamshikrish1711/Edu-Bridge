// frontend/src/pages/Login.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiError } from "../api/client";
import { ROLE_HOME, useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";

const DEMOS = [
  ["student1@edubridge.test", "Student"],
  ["ngo1@edubridge.test", "NGO"],
  ["donor1@edubridge.test", "Donor"],
  ["mentor1@edubridge.test", "Mentor"],
  ["admin@edubridge.test", "Admin"],
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function fillDemo(email) {
    setForm({
      email,
      password: email.startsWith("admin") ? "Admin@12345" : "Demo@12345",
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      toast(`Signed in as ${user.name}.`, "success");
      const target = location.state?.from || ROLE_HOME[user.role] || "/";
      navigate(target, { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Log in</h1>
        <p className="muted">Use one of the demo accounts or your own.</p>
        <div className="alert alert-info">
          Portfolio demo: synthetic data and mock payments. Do not enter real card
          details.
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            required
            autoComplete="current-password"
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="small muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>

      <div className="card auth-card">
        <h2>Demo logins</h2>
        <p className="small muted">Passwords: Demo@12345. Admin: Admin@12345.</p>
        <div className="stack-sm">
          {DEMOS.map(([email, label]) => (
            <button
              key={email}
              type="button"
              className="demo-row"
              onClick={() => fillDemo(email)}
            >
              <strong>{label}</strong>
              <span>{email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
