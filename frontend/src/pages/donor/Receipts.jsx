// frontend/src/pages/donor/Receipts.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../../api/client";
import { downloadReceipt } from "../../api/download";
import EmptyState from "../../components/EmptyState";
import { money } from "../../components/ProgramCard";
import { useToast } from "../../components/Toast";

export default function Receipts() {
  const toast = useToast();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/donations")
      .then((response) => setDonations(response.data.donations))
      .catch((error) => toast(apiError(error), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  async function download(id, receiptNo) {
    try {
      await downloadReceipt(id, receiptNo);
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  const rows = donations.filter((row) => row.status === "success");

  if (loading) return <p className="muted">Loading receipts...</p>;

  return (
    <div className="stack">
      <div>
        <h1>Receipts</h1>
        <p className="muted">Each successful donation has a numbered PDF receipt.</p>
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No receipts yet" message="Successful donations appear here." />
      ) : (
        <div className="grid grid-2">
          {rows.map((donation) => (
            <article className="card stack-sm" key={donation.id}>
              <div className="row between">
                <strong>{donation.receipt_no}</strong>
                <span className="small muted">
                  {new Date(donation.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
              <p>{donation.program_title || donation.student_name}</p>
              <p className="muted">{money(donation.amount)}</p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => download(donation.id, donation.receipt_no)}
              >
                Download PDF
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
