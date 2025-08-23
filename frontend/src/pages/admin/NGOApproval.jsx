import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function NGOApproval() {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    // TODO: Fetch pending NGOs from backend API
    setNgos([
      { id: 1, name: "Helping Hands", email: "contact@helpinghands.org", status: "Pending" },
      { id: 2, name: "Bright Future", email: "info@brightfuture.org", status: "Pending" },
    ]);
  }, []);

  const approveNGO = (id) => {
    // TODO: API call to approve NGO
    setNgos((prev) => prev.filter((ngo) => ngo.id !== id));
  };

  const rejectNGO = (id) => {
    // TODO: API call to reject NGO
    setNgos((prev) => prev.filter((ngo) => ngo.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">NGO Approval Requests</h1>
        {ngos.length === 0 ? (
          <p className="text-center text-gray-600">No pending NGO approvals.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">NGO Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ngos.map((ngo) => (
                <tr key={ngo.id}>
                  <td className="border border-gray-300 p-2">{ngo.name}</td>
                  <td className="border border-gray-300 p-2">{ngo.email}</td>
                  <td className="border border-gray-300 p-2">{ngo.status}</td>
                  <td className="border border-gray-300 p-2 space-x-2">
                    <button
                      onClick={() => approveNGO(ngo.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectNGO(ngo.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
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