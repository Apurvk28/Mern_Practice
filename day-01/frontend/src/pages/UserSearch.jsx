import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUsers } from "../services/user.service.js";

function UserSearch() {
  const location = useLocation();

  const searchParams = new URLSearchParams(
    location.search
  );

  const search = searchParams.get("search") || "";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers(search);

        setUsers(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to search users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search]);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>User Search</h1>

      <p>
        Search term: {search || "All users"}
      </p>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user._id}>
            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default UserSearch;