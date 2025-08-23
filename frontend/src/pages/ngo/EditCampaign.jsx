import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function EditCampaign() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch campaign details by id from API
    setFormData({
      title: "Sample Campaign",
      description: "Sample description",
      goalAmount: 10000,
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to update campaign
    alert("Campaign updated (mock).");
    navigate("/ngo/campaigns");
  };

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Campaign</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="title">
              Campaign Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.title}
              onChange={handleChange}
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
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="goalAmount">
              Goal Amount (₹)
            </label>
            <input
              type="number"
              id="goalAmount"
              name="goalAmount"
              min="0"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.goalAmount}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Update Campaign
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}