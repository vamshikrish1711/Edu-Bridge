import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function BrowseMentorCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // TODO: Fetch campaigns available for mentoring from API
    setCampaigns([
      {
        id: 1,
        title: "Basic Literacy Program",
        ngo: "Helping Hands",
        description: "Teach basic reading and writing skills.",
      },
      {
        id: 2,
        title: "STEM Awareness",
        ngo: "Bright Future",
        description: "Mentor students in STEM subjects.",
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Available Campaigns to Mentor</h1>
        {campaigns.length === 0 ? (
          <p className="text-center text-gray-600">No campaigns available.</p>
        ) : (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded p-4 shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold">{campaign.title}</h2>
                <p className="text-gray-600 mb-2">NGO: {campaign.ngo}</p>
                <p className="mb-2">{campaign.description}</p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => alert("Request to join campaign (mock)")}
                >
                  Request to Join
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}