import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">Student Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/student/campaigns"
            className="bg-indigo-600 text-white rounded p-6 text-center hover:bg-indigo-700 transition"
          >
            Explore Campaigns
          </Link>
          <Link
            to="/student/mentors"
            className="bg-blue-600 text-white rounded p-6 text-center hover:bg-blue-700 transition"
          >
            Find Mentors
          </Link>
          <Link
            to="/student/sessions"
            className="bg-green-600 text-white rounded p-6 text-center hover:bg-green-700 transition"
          >
            My Sessions
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}