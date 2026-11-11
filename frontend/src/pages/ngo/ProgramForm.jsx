// frontend/src/pages/ngo/ProgramForm.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { apiError } from "../../api/client";
import { useToast } from "../../components/Toast";

const EMPTY = {
  title: "",
  type: "donation",
  description: "",
  start_date: "",
  end_date: "",
  target_amount: 0,
  volunteer_slots: 0,
  status: "upcoming",
};

export default function ProgramForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/programs/${id}`)
      .then((response) => {
        const program = response.data.program;
        setForm({
          title: program.title,
          type: program.type,
          description: program.description,
          start_date: program.start_date || "",
          end_date: program.end_date || "",
          target_amount: program.target_amount,
          volunteer_slots: program.volunteer_slots,
          status: program.status,
        });
      })
      .catch((err) => setError(apiError(err)));
  }, [id]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      ...form,
      target_amount: Number(form.target_amount || 0),
      volunteer_slots: Number(form.volunteer_slots || 0),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };
    try {
      if (id) {
        await api.put(`/programs/${id}`, payload);
        toast("Program updated.", "success");
      } else {
        await api.post("/programs", payload);
        toast("Program created.", "success");
      }
      navigate("/ngo");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <Link className="text-link" to="/ngo">Back to dashboard</Link>
      <form className="card stack" onSubmit={submit}>
        <h1>{id ? "Edit program" : "Create program"}</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Title
          <input name="title" value={form.title} onChange={change} required minLength={3} />
        </label>
        <div className="grid grid-2">
          <label>
            Type
            <select name="type" value={form.type} onChange={change}>
              <option value="donation">Donation</option>
              <option value="volunteering">Volunteering</option>
              <option value="mentorship">Mentorship</option>
              <option value="scholarship">Scholarship</option>
            </select>
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={change}>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={change} required minLength={10} />
        </label>
        <div className="grid grid-2">
          <label>
            Start date
            <input name="start_date" type="date" value={form.start_date} onChange={change} />
          </label>
          <label>
            End date
            <input name="end_date" type="date" value={form.end_date} onChange={change} />
          </label>
          <label>
            Target amount (INR)
            <input name="target_amount" type="number" min="0" value={form.target_amount} onChange={change} />
          </label>
          <label>
            Volunteer slots
            <input name="volunteer_slots" type="number" min="0" value={form.volunteer_slots} onChange={change} />
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving..." : id ? "Save changes" : "Create program"}
        </button>
      </form>
    </div>
  );
}
