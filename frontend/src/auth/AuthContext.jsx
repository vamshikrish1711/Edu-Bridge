// frontend/src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const ROLE_HOME = {
  student: "/student",
  ngo: "/ngo",
  donor: "/donor",
  mentor: "/mentor",
  admin: "/admin/analytics",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("eb_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem("eb_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("eb_token", response.data.access_token);
    setUser(response.data.user);
    return response.data.user;
  }

  async function register(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
  }

  function logout() {
    localStorage.removeItem("eb_token");
    setUser(null);
  }

  async function refresh() {
    const response = await api.get("/auth/me");
    setUser(response.data.user);
    return response.data;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
