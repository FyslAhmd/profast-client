import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUsers([]);
    try {
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      setUsers(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch users", "error");
    }
    setLoading(false);
  };

  const handleRoleChange = async (user, role) => {
    Swal.fire({
      title: "Are you sure you?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/users/${user._id}/role`, { role });
          setUsers((prev) =>
            prev.map((u) => (u._id === user._id ? { ...u, role } : u))
          );
          Swal.fire("Success", `Role changed to ${role}`, "success");
        } catch {
          Swal.fire("Error", "Role update failed", "error");
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">Make Admin</h1>
      <p className="mb-6 text-gray-600">
        Enter a Gmail address (full or partial) and search for users to make or
        remove admin.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex items-center bg-gray-200 max-w-md rounded-full overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Enter Email..."
            className="flex-grow px-4 py-2 bg-gray-200 focus:outline-none text-sm"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <button
            className="btn btn-primary text-black rounded-full px-6"
            type="submit"
            disabled={loading || !searchEmail}
            onClick={handleSearch}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {users.length === 0 && !loading && (
        <div className="text-gray-500">
          No users found. Try searching for a Email address.
        </div>
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="text-lg text-black">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-base font-medium">
              {users.map((user, idx) => (
                <tr key={user._id}>
                  <td>{idx + 1}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin" ? "badge-success" : "badge-ghost"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {user.role === "admin" ? (
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleRoleChange(user, "user")}
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleRoleChange(user, "admin")}
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
