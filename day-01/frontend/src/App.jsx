import { useEffect, useState } from "react";
import Users from "./components/Users.jsx";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} from "./services/user.service.js";

function App() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers();

        setUsers(data);
      } catch (error) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const data = await createUser({
        name,
        email,
        password,
      });

      setUsers((previousUsers) => [
        ...previousUsers,
        data.user,
      ]);

      setSuccess("User created successfully");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create user"
      );
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      setError("");
      setSuccess("");

      const response = await updateUser(id, data);

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === id ? response.user : user
        )
      );

      setSuccess("User updated successfully");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update user"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      setSuccess("");

      await deleteUser(id);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== id)
      );

      setSuccess("User deleted successfully");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  return (
    <div>
      <h1>Create User</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Create User
        </button>
      </form>

      {success && <p>{success}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Users
          users={users}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default App;