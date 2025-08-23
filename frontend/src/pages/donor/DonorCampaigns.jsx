import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function DonorCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // TODO: Fetch active campaigns from backend API
    setCampaigns([
      {
        id: 1,
        title: "Basic Literacy Program",
        ngo: "Helping Hands",
        goalAmount: 100000,
        raisedAmount: 45000,
      },
      {
        id: 2,
        title: "STEM Awareness",
        ngo: "Bright Future",
        goalAmount: 150000,
        raisedAmount: 90000,
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Active Campaigns</h1>
        {campaigns.length === 0 ? (
          <p className="text-center text-gray-600">No active campaigns found.</p>
        ) : (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded p-4 shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold">{campaign.title}</h2>
                <p className="text-gray-600 mb-2">NGO: {campaign.ngo}</p>
                <p className="mb-2">
                  Raised: ₹{campaign.raisedAmount.toLocaleString()} / ₹{campaign.goalAmount.toLocaleString()}
                </p>
                <Link
                  to={`/donor/donate/${campaign.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Donate Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}