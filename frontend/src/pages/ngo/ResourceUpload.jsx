// frontend/src/pages/ngo/ResourceUpload.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { apiError } from "../../api/client";
import { useToast } from "../../components/Toast";

export default function ResourceUpload() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    title: "",
    type: "pdf",
    topic: "",
    skill_level: "beginner",
    description: "",
    url: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (file) {
        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => data.append(key, value));
        data.append("file", file);
        await api.post("/resources", data);
      } else {
        await api.post("/resources", form);
      }
      toast("Resource uploaded.", "success");
      navigate("/resources");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <h1>Upload resource</h1>
      <p className="muted">PDF, MP4, EPUB or DOCX up to 20 MB. Or paste a URL.</p>
      <form className="card stack" onSubmit={submit}>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Title
          <input name="title" value={form.title} onChange={change} required minLength={3} />
        </label>
        <div className="grid grid-2">
          <label>
            Type
            <select name="type" value={form.type} onChange={change}>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
              <option value="ebook">Ebook</option>
            </select>
          </label>
          <label>
            Skill level
            <select name="skill_level" value={form.skill_level} onChange={change}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>
        <label>
          Topic
          <input name="topic" value={form.topic} onChange={change} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={change} />
        </label>
        <label>
          URL
          <input name="url" value={form.url} onChange={change} placeholder="https://" />
        </label>
        <label>
          File
          <input type="file" accept=".pdf,.mp4,.epub,.docx" onChange={(event) => setFile(event.target.files[0] || null)} />
        </label>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Uploading..." : "Upload resource"}
        </button>
      </form>
    </div>
  );
}
