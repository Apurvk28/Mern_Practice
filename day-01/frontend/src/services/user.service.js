import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/api/users`);

  return response.data.users;
};

export const createUser = async ({ name, email, password }) => {
  const response = await axios.post(
    `${API_URL}/api/users`,
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axios.patch(
    `${API_URL}/api/users/${id}`,
    data
  );

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(
    `${API_URL}/api/users/${id}`
  );

  return response.data;
};