import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function StudentSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // TODO: Fetch student's sessions
    setSessions([
      {
        id: 1,
        mentorName: "Ravi Kumar",
        date: "2025-08-02",
        time: "11:00 AM",
        campaign: "Math Mastery",
      },
      {
        id: 2,
        mentorName: "Priya Sharma",
        date: "2025-08-04",
        time: "4:00 PM",
        campaign: "Career Guidance",
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">My Sessions</h1>
        {sessions.length === 0 ? (
          <p className="text-center text-gray-600">You have no upcoming sessions.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Campaign</th>
                <th className="border border-gray-300 p-2">Mentor</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="border border-gray-300 p-2">{session.campaign}</td>
                  <td className="border border-gray-300 p-2">{session.mentorName}</td>
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