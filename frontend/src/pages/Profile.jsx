// frontend/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
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
    ["mission", "Mission", "textarea"],
    ["contact_number", "Contact number"],
    ["address", "Address", "textarea"],
    ["description", "Description", "textarea"],
  ],
  donor: [["donation_type", "Donation type", "select"]],
  mentor: [
    ["expertise", "Expertise"],
    ["availability", "Availability"],
  ],
  admin: [],
};

export default function Profile() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/profile")
      .then((response) => {
        setForm({
          name: response.data.user.name || "",
          phone: response.data.user.phone || "",
        });
        setProfile(response.data.profile || {});
      })
      .catch((err) => setError(apiError(err)));
  }, []);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function changeProfile(event) {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.put("/profile", { ...form, ...profile });
      await refresh();
      toast("Profile saved.", "success");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <h1>Profile</h1>
      <p className="muted">
        Signed in as {user?.email} ({user?.role}).
      </p>
      <form className="card stack" onSubmit={save}>
        {error && <div className="alert alert-error">{error}</div>}
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
        {(FIELDS[user?.role] || []).map(([name, label, type]) => (
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
          {busy ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}
