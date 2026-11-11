// frontend/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiError } from "../api/client";
import { ROLE_HOME, useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";

const FIELDS = {
  student: [
    ["education", "Education"],
    ["skills", "Skills"],
    ["interests", "Interests"],
    ["location", "Location"],
    ["date_of_birth", "Date of birth", "date"],
    ["address", "Address", "textarea"],
  ],
  ngo: [
    ["org_type", "Organisation type"],
    ["mission", "Mission"],
    ["contact_number", "Contact number"],
    ["address", "Address", "textarea"],
    ["description", "Description", "textarea"],
  ],
  donor: [["donation_type", "Donation type", "select"]],
  mentor: [
    ["expertise", "Expertise"],
    ["availability", "Availability"],
  ],
};

const ROLES = ["student", "ngo", "donor", "mentor"];

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [profile, setProfile] = useState({ donation_type: "monetary" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const [busy, setBusy] = useState(false);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function changeProfile(event) {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setPending("");
    setBusy(true);
    try {
      const data = await register({ ...form, role, profile });
      if (data.status === "active") {
        await login(form.email, form.password);
        toast("Account created. You are signed in.", "success");
        navigate(ROLE_HOME[role], { replace: true });
      } else {
        setPending(data.message);
      }
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="card auth-card wide" onSubmit={submit}>
        <h1>Create an account</h1>
        <p className="muted">
          NGOs and mentors are reviewed by an admin before they can log in. Students
          and donors get access immediately.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        {pending && (
          <div className="alert alert-success">
            {pending} <Link to="/login">Go to login</Link>
          </div>
        )}

        <label>
          I am a
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-2">
          <label>
            Full name
            <input name="name" value={form.name} onChange={change} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={change} />
          </label>
        </div>
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
          {role === "student" && (
            <span className="hint">Use an institution or verified email address.</span>
          )}
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            minLength={8}
            required
            autoComplete="new-password"
          />
          <span className="hint">At least 8 characters.</span>
        </label>

        <h2 className="form-section">Profile</h2>
        {FIELDS[role].map(([name, label, type]) => (
          <label key={name}>
            {label}
            {type === "textarea" ? (
              <textarea name={name} value={profile[name] || ""} onChange={changeProfile} />
            ) : type === "select" ? (
              <select name={name} value={profile[name] || "monetary"} onChange={changeProfile}>
                <option value="monetary">Monetary</option>
                <option value="material">Material</option>
              </select>
            ) : (
              <input
                name={name}
                type={type || "text"}
                value={profile[name] || ""}
                onChange={changeProfile}
              />
            )}
          </label>
        ))}

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </button>
        <p className="small muted">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
