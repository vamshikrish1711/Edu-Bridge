// frontend/src/pages/admin/Users.jsx
import { useEffect, useState } from "react";
import api, { apiError } from "../../api/client";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

export default function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ role: "", status: "", q: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const timer = window.setTimeout(() => {
      api
        .get(`/admin/users?${params.toString()}`)
        .then((response) => setUsers(response.data.users))
        .catch((error) => toast(apiError(error), "error"))
        .finally(() => setLoading(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters, toast]);

  function change(event) {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  }

  async function setStatus(id, status) {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      toast(`Account ${status}.`, "success");
      setUsers((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  return (
    <div className="stack">
      <div>
        <h1>Users</h1>
        <p className="muted">Suspend or reactivate any account except your own.</p>
      </div>

      <div className="card filter-row">
        <label>
          Search
          <input name="q" value={filters.q} onChange={change} placeholder="name or email" />
        </label>
        <label>
          Role
          <select name="role" value={filters.role} onChange={change}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="ngo">NGO</option>
            <option value="donor">Donor</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label>
          Status
          <select name="status" value={filters.status} onChange={change}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="muted">Loading users...</p>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><StatusBadge status={user.status} /></td>
                  <td>
                    {user.status === "active" ? (
                      <button className="btn btn-sm btn-danger" onClick={() => setStatus(user.id, "suspended")}>
                        Suspend
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline" onClick={() => setStatus(user.id, "active")}>
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
