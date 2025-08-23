import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function StudentCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // TODO: Fetch available campaigns for students
    setCampaigns([
      {
        id: 1,
        title: "Digital Literacy",
        ngo: "Code4All",
        description: "Learn how to use computers and the internet.",
      },
      {
        id: 2,
        title: "Career Guidance",
        ngo: "Youth Boost",
        description: "Get help with planning your education and career path.",
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Available Campaigns</h1>
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  onClick={() => alert("Join campaign (mock)")}
                >
                  Join Campaign
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