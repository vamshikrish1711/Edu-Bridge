// frontend/src/pages/Resources.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../api/client";
import EmptyState from "../components/EmptyState";
import { useToast } from "../components/Toast";

const LEVELS = ["", "beginner", "intermediate", "advanced"];
const TYPES = ["", "pdf", "video", "link", "ebook"];

export default function Resources() {
  const toast = useToast();
  const [filters, setFilters] = useState({ topic: "", level: "", type: "", q: "" });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const timer = window.setTimeout(() => {
      api
        .get(`/resources?${params.toString()}`)
        .then((response) => setResources(response.data.resources))
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
          <h1>Study resources</h1>
          <p className="muted">Uploaded by mentors and NGOs. Filter by topic and level.</p>
        </div>
      </div>

      <div className="card filter-row">
        <label>
          Search
          <input name="q" value={filters.q} onChange={change} placeholder="Python, design, finance" />
        </label>
        <label>
          Topic
          <input name="topic" value={filters.topic} onChange={change} placeholder="Data Science" />
        </label>
        <label>
          Level
          <select name="level" value={filters.level} onChange={change}>
            {LEVELS.map((level) => (
              <option key={level || "all"} value={level}>
                {level || "All levels"}
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
        <p className="muted">Loading resources...</p>
      ) : resources.length === 0 ? (
        <EmptyState title="No resources yet" message="Try a different topic or level." />
      ) : (
        <div className="grid grid-3">
          {resources.map((resource) => (
            <article className="card" key={resource.id}>
              <div className="row between">
                <span className="pill">{resource.type}</span>
                <span className="small muted">{resource.skill_level}</span>
              </div>
              <h3>{resource.title}</h3>
              <p className="small muted">
                {resource.topic} · {resource.uploader_name}
              </p>
              <p>{resource.description}</p>
              {resource.url || resource.file_path ? (
                <a
                  className="text-link"
                  href={resource.url || `/api/${resource.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open resource
                </a>
              ) : (
                <span className="muted small">No file attached.</span>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
