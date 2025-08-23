import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function DonorDashboard() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Donor Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/donor/campaigns"
            className="bg-blue-600 text-white rounded p-6 text-center hover:bg-blue-700 transition"
          >
            Browse Campaigns
          </Link>
          <Link
            to="/donor/profile"
            className="bg-green-600 text-white rounded p-6 text-center hover:bg-green-700 transition"
          >
            Profile Settings
          </Link>
          <Link
            to="/donor/donations"
            className="bg-purple-600 text-white rounded p-6 text-center hover:bg-purple-700 transition"
          >
            My Donations
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}