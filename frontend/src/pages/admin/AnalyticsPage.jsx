import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    ngos: 0,
    mentors: 0,
    donors: 0,
    campaigns: 0,
    donationsTotal: 0,
  });

  useEffect(() => {
    // TODO: Fetch analytics data from backend API
    setStats({
      ngos: 55,
      mentors: 120,
      donors: 180,
      campaigns: 40,
      donationsTotal: 1250000,
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Platform Analytics</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-100 rounded p-6 text-center">
            <h2 className="text-3xl font-extrabold">{stats.ngos}</h2>
            <p className="text-blue-700 font-semibold">NGOs Registered</p>
          </div>
          <div className="bg-green-100 rounded p-6 text-center">
            <h2 className="text-3xl font-extrabold">{stats.mentors}</h2>
            <p className="text-green-700 font-semibold">Mentors Registered</p>
          </div>
          <div className="bg-purple-100 rounded p-6 text-center">
            <h2 className="text-3xl font-extrabold">{stats.donors}</h2>
            <p className="text-purple-700 font-semibold">Donors Registered</p>
          </div>
          <div className="bg-yellow-100 rounded p-6 text-center">
            <h2 className="text-3xl font-extrabold">{stats.campaigns}</h2>
            <p className="text-yellow-700 font-semibold">Active Campaigns</p>
          </div>
          <div className="col-span-2 bg-indigo-100 rounded p-6 text-center">
            <h2 className="text-3xl font-extrabold">₹{stats.donationsTotal.toLocaleString()}</h2>
            <p className="text-indigo-700 font-semibold">Total Donations</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}