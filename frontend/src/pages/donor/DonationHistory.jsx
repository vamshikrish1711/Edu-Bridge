import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function DonationHistory() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // TODO: Fetch donor's donation history from backend API
    setDonations([
      {
        id: 1,
        campaignTitle: "Basic Literacy Program",
        amount: 5000,
        date: "2025-07-15",
      },
      {
        id: 2,
        campaignTitle: "STEM Awareness",
        amount: 2000,
        date: "2025-07-20",
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">My Donations</h1>
        {donations.length === 0 ? (
          <p className="text-center text-gray-600">No donation history found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Campaign</th>
                <th className="border border-gray-300 p-2">Amount (₹)</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="border border-gray-300 p-2">{donation.campaignTitle}</td>
                  <td className="border border-gray-300 p-2">{donation.amount.toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">{donation.date}</td>
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