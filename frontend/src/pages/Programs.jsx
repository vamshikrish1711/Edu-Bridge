// frontend/src/pages/Programs.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../api/client";
import EmptyState from "../components/EmptyState";
import ProgramCard from "../components/ProgramCard";
import { useToast } from "../components/Toast";

const STATUSES = ["", "upcoming", "active", "completed"];
const TYPES = ["", "donation", "volunteering", "mentorship", "scholarship"];

export default function Programs() {
  const toast = useToast();
  const [filters, setFilters] = useState({ status: "", type: "", q: "" });
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.type) params.set("type", filters.type);
    if (filters.q) params.set("q", filters.q);
    const timer = window.setTimeout(() => {
      api
        .get(`/programs?${params.toString()}`)
        .then((response) => setPrograms(response.data.programs))
        .catch((error) => toast(apiError(error), "error"))
        .finally(() => setLoading(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, toast]);

  function change(event) {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  }

  return (
    <div className="stack">
      <div className="section-head">
        <div>
          <h1>Programs</h1>
          <p className="muted">Filter by status, type or search the description.</p>
        </div>
      </div>

      <div className="card filter-row">
        <label>
          Search
          <input name="q" value={filters.q} onChange={change} placeholder="scholarship, Python, library" />
        </label>
        <label>
          Status
          <select name="status" value={filters.status} onChange={change}>
            {STATUSES.map((status) => (
              <option key={status || "all"} value={status}>
                {status || "All statuses"}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select name="type" value={filters.type} onChange={change}>
            {TYPES.map((type) => (
              <option key={type || "all"} value={type}>
                {type || "All types"}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="muted">Loading programs...</p>
      ) : programs.length === 0 ? (
        <EmptyState title="No programs match" message="Change the filters or clear the search." />
      ) : (
        <div className="grid grid-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}
