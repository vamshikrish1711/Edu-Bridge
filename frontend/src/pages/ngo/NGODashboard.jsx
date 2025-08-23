import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function NGODashboard() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">NGO Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/ngo/campaigns"
            className="bg-blue-600 text-white rounded p-6 text-center hover:bg-blue-700 transition"
          >
            Manage Campaigns
          </Link>
          <Link
            to="/ngo/profile"
            className="bg-green-600 text-white rounded p-6 text-center hover:bg-green-700 transition"
          >
            Profile Settings
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}