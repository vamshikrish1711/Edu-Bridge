import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/admin/ngo-approval"
            className="bg-blue-600 text-white rounded p-6 text-center hover:bg-blue-700 transition"
          >
            NGO Approvals
          </Link>
          <Link
            to="/admin/mentor-approval"
            className="bg-green-600 text-white rounded p-6 text-center hover:bg-green-700 transition"
          >
            Mentor Approvals
          </Link>
          <Link
            to="/admin/users"
            className="bg-purple-600 text-white rounded p-6 text-center hover:bg-purple-700 transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/analytics"
            className="bg-yellow-600 text-white rounded p-6 text-center hover:bg-yellow-700 transition col-span-full md:col-span-3"
          >
            View Analytics
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}