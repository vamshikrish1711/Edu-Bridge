import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function NGOCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // TODO: Fetch NGO's campaigns from backend API
    setCampaigns([
      {
        id: 1,
        title: "Basic Literacy Program",
        status: "Active",
      },
      {
        id: 2,
        title: "STEM Awareness",
        status: "Completed",
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Campaigns</h1>
        <Link
          to="/ngo/campaigns/new"
          className="inline-block mb-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Create New Campaign
        </Link>
        {campaigns.length === 0 ? (
          <p className="text-center text-gray-600">No campaigns found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="border border-gray-300 p-2">{campaign.title}</td>
                  <td className="border border-gray-300 p-2">{campaign.status}</td>
                  <td className="border border-gray-300 p-2 space-x-2">
                    <Link
                      to={`/ngo/campaigns/edit/${campaign.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        // TODO: Delete campaign API call
                        alert("Delete functionality to be implemented");
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </>
  );
}