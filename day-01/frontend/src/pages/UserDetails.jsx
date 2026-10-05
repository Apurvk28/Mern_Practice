import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import { getUserById } from "../services/user.service.js";

function UserDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUserById(id);

        setUser(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load user"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <p>Loading user...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button onClick={() => navigate("/users")}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>User Details</h1>

      <p>
        <strong>Name:</strong> {user.name}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <button onClick={() => navigate("/users")}>
        Back to Users
      </button>
    </div>
  );
}

export default UserDetails;