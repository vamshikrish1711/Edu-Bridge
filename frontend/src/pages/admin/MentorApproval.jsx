import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function MentorApproval() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    // TODO: Fetch pending mentor approvals from backend
    setMentors([
      { id: 1, name: "Jane Doe", email: "jane@example.com", skills: "Math, Science", status: "Pending" },
      { id: 2, name: "John Smith", email: "john@example.com", skills: "Coding, Physics", status: "Pending" },
    ]);
  }, []);

  const approveMentor = (id) => {
    // TODO: API call to approve mentor
    setMentors((prev) => prev.filter((mentor) => mentor.id !== id));
  };

  const rejectMentor = (id) => {
    // TODO: API call to reject mentor
    setMentors((prev) => prev.filter((mentor) => mentor.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Mentor Approval Requests</h1>
        {mentors.length === 0 ? (
          <p className="text-center text-gray-600">No pending mentor approvals.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Mentor Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Skills</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr key={mentor.id}>
                  <td className="border border-gray-300 p-2">{mentor.name}</td>
                  <td className="border border-gray-300 p-2">{mentor.email}</td>
                  <td className="border border-gray-300 p-2">{mentor.skills}</td>
                  <td className="border border-gray-300 p-2">{mentor.status}</td>
                  <td className="border border-gray-300 p-2 space-x-2">
                    <button
                      onClick={() => approveMentor(mentor.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectMentor(mentor.id)}
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