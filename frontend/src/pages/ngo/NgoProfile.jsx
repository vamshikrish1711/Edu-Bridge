import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function NGOProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    // TODO: Fetch NGO profile from API
    setProfile({
      name: "Helping Hands",
      email: "contact@helpinghands.org",
      description: "We provide education for underprivileged children.",
    });
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to update profile
    alert("Profile updated (mock).");
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="name">
              NGO Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={profile.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">
              Email (cannot be changed)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              value={profile.email}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={profile.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}