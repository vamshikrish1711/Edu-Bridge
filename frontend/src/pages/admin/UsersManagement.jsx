import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // TODO: Fetch all users from API
    setUsers([
      { id: 1, name: "Admin User", email: "admin@edubridge.com", role: "admin" },
      { id: 2, name: "Helping Hands", email: "contact@helpinghands.org", role: "ngo" },
      { id: 3, name: "Jane Doe", email: "jane@example.com", role: "mentor" },
      { id: 4, name: "John Donor", email: "john@donor.com", role: "donor" },
    ]);
  }, []);

  const deleteUser = (id) => {
    // TODO: API call to delete user
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
        {users.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Role</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2 capitalize">{user.role}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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