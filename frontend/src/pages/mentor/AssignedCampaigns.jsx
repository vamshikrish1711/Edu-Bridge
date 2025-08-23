import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AssignedCampaigns() {
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    // TODO: Fetch campaigns assigned to mentor from API
    setAssigned([
      {
        id: 1,
        title: "Basic Literacy Program",
        ngo: "Helping Hands",
        status: "Ongoing",
      },
      {
        id: 2,
        title: "STEM Awareness",
        ngo: "Bright Future",
        status: "Ongoing",
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Assigned Campaigns</h1>
        {assigned.length === 0 ? (
          <p className="text-center text-gray-600">No assigned campaigns.</p>
        ) : (
          <div className="space-y-6">
            {assigned.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded p-4 shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold">{campaign.title}</h2>
                <p className="text-gray-600 mb-2">NGO: {campaign.ngo}</p>
                <p>Status: {campaign.status}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}