// frontend/src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container page">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>Edu-Bridge</span>
          <span>Portfolio demo · synthetic data and mock payments</span>
        </div>
      </footer>
    </div>
  );
}
