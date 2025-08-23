import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function StudentMentors() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    // TODO: Fetch available mentors
    setMentors([
      {
        id: 1,
        name: "Ravi Kumar",
        expertise: "Mathematics",
        email: "ravi@example.com",
      },
      {
        id: 2,
        name: "Priya Sharma",
        expertise: "Career Guidance",
        email: "priya@example.com",
      },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Available Mentors</h1>
        {mentors.length === 0 ? (
          <p className="text-center text-gray-600">No mentors available.</p>
        ) : (
          <div className="space-y-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="border rounded p-4 shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold">{mentor.name}</h2>
                <p>Expertise: {mentor.expertise}</p>
                <p>Email: {mentor.email}</p>
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => alert(`Request session with ${mentor.name}`)}
                >
                  Request Session
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