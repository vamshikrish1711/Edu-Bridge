// frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../api/client";
import { useToast } from "../components/Toast";
import ProgramCard, { money } from "../components/ProgramCard";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [programs, setPrograms] = useState([]);
  const toast = useToast();

  useEffect(() => {
    Promise.all([api.get("/stats"), api.get("/programs?status=active")])
      .then(([statsResponse, programsResponse]) => {
        setStats(statsResponse.data);
        setPrograms(programsResponse.data.programs.slice(0, 3));
      })
      .catch((error) => toast(apiError(error), "error"));
  }, [toast]);

  return (
    <div className="stack-lg">
      <section className="hero">
        <div>
          <p className="eyebrow">Verified NGOs. Named students. Numbered receipts.</p>
          <h1>Support students through verified programs</h1>
          <p className="hero-copy">
            Browse programs from approved NGOs, apply for a scholarship, or book a
            mentor. Every donation gets a receipt with a number you can check.
          </p>
          <div className="row wrap gap">
            <Link className="btn btn-primary" to="/programs">
              Browse programs
            </Link>
            <Link className="btn btn-outline" to="/register">
              Create an account
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="stat">
            <span className="stat-value">{stats ? stats.students : "-"}</span>
            <span className="stat-label">Students</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats ? stats.active_programs : "-"}</span>
            <span className="stat-label">Active programs</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats ? stats.mentors : "-"}</span>
            <span className="stat-label">Mentors</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {stats ? money(stats.total_donations) : "-"}
            </span>
            <span className="stat-label">Donated so far</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Active programs</h2>
            <p className="muted">Newest first. Filter by type on the programs page.</p>
          </div>
          <Link className="text-link" to="/programs">
            See all
          </Link>
        </div>
        {programs.length === 0 ? (
          <p className="muted">No active programs yet.</p>
        ) : (
          <div className="grid grid-3">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-3">
        <div className="card">
          <h3>For students</h3>
          <p className="muted">
            Apply to scholarships, volunteering and mentorship programs. Track each
            application from pending to approved.
          </p>
          <Link className="text-link" to="/register">
            Register as a student
          </Link>
        </div>
        <div className="card">
          <h3>For NGOs</h3>
          <p className="muted">
            List programs, review applications and watch funds raised against the
            target. Admin approval is required first.
          </p>
          <Link className="text-link" to="/register">
            Register an NGO
          </Link>
        </div>
        <div className="card">
          <h3>For donors and mentors</h3>
          <p className="muted">
            Fund a program or a named student. Mentors review requests and schedule
            sessions with a link or a room.
          </p>
          <Link className="text-link" to="/register">
            Register to give or guide
          </Link>
        </div>
      </section>
    </div>
  );
}
