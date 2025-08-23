import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // TODO: Fetch mentor's sessions from API
    setSessions([
      {
        id: 1,
        campaignTitle: "Basic Literacy Program",
        date: "2025-08-01",
        time: "10:00 AM",
        studentName: "Asha",
      },
      {
        id: 2,
        campaignTitle: "STEM Awareness",
        date: "2025-08-05",
        time: "3:00 PM",
        studentName: "Ravi",
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">My Sessions</h1>
        {sessions.length === 0 ? (
          <p className="text-center text-gray-600">No scheduled sessions.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Campaign</th>
                <th className="border border-gray-300 p-2">Student</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="border border-gray-300 p-2">{session.campaignTitle}</td>
                  <td className="border border-gray-300 p-2">{session.studentName}</td>
                  <td className="border border-gray-300 p-2">{session.date}</td>
                  <td className="border border-gray-300 p-2">{session.time}</td>
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