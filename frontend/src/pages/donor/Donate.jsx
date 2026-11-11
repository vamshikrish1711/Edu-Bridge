// frontend/src/pages/donor/Donate.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { apiError } from "../../api/client";
import { downloadReceipt } from "../../api/download";
import { useToast } from "../../components/Toast";

export default function Donate() {
  const [params] = useSearchParams();
  const toast = useToast();
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [mode, setMode] = useState("program");
  const [form, setForm] = useState({
    target: params.get("program") || "",
    amount: "500",
    card_number: "4111111111111111",
    donation_type: "monetary",
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/programs"), api.get("/students")])
      .then(([programResponse, studentResponse]) => {
        setPrograms(programResponse.data.programs);
        setStudents(studentResponse.data.students);
      })
      .catch((err) => setError(apiError(err)));
  }, []);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess(null);
    const payload = {
      amount: Number(form.amount),
      donation_type: form.donation_type,
      card_number: form.card_number,
    };
    if (mode === "program") payload.program_id = Number(form.target);
    else payload.student_id = Number(form.target);

    try {
      const response = await api.post("/donations", payload);
      setSuccess(response.data.donation);
      toast("Donation recorded. Receipt ready.", "success");
    } catch (err) {
      const message = apiError(err);
      setError(message);
      if (err.response?.data?.donation) {
        toast("Payment declined. Try the success test card.", "error");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <h1>Donate</h1>
      <p className="muted">
        Mock gateway. Amounts from INR 10 to INR 500,000. Card 4000000000000002 always fails.
      </p>

      <form className="card stack" onSubmit={submit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Donation recorded. Receipt {success.receipt_no}.
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => downloadReceipt(success.id, success.receipt_no)}
            >
              Download receipt
            </button>
          </div>
        )}

        <div className="row gap">
          <label className="radio">
            <input
              type="radio"
              checked={mode === "program"}
              onChange={() => {
                setMode("program");
                setForm({ ...form, target: params.get("program") || "" });
              }}
            />
            Give to a program
          </label>
          <label className="radio">
            <input
              type="radio"
              checked={mode === "student"}
              onChange={() => {
                setMode("student");
                setForm({ ...form, target: "" });
              }}
            />
            Give to a student
          </label>
        </div>

        <label>
          {mode === "program" ? "Program" : "Student"}
          <select name="target" value={form.target} onChange={change} required>
            <option value="">Choose one</option>
            {(mode === "program" ? programs : students).map((item) => (
              <option key={item.id} value={item.id}>
                {mode === "program" ? item.title : `${item.name} · ${item.location || "India"}`}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-2">
          <label>
            Amount (INR)
            <input
              name="amount"
              type="number"
              min="10"
              max="500000"
              value={form.amount}
              onChange={change}
              required
            />
          </label>
          <label>
            Donation type
            <select name="donation_type" value={form.donation_type} onChange={change}>
              <option value="monetary">Monetary</option>
              <option value="material">Material</option>
            </select>
          </label>
        </div>

        <label>
          Test card number
          <input name="card_number" value={form.card_number} onChange={change} required minLength={12} />
          <span className="hint">4111111111111111 succeeds. 4000000000000002 fails.</span>
        </label>

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Processing..." : "Pay with mock gateway"}
        </button>
      </form>
    </div>
  );
}
