import axiosInstance from "../api/axios.js";

export const getUsers = async (search = "") => {
  const response = await axiosInstance.get("/api/users", {
    params: {
      search,
    },
  });

  return response.data.users;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(
    `/api/users/${id}`
  );

  return response.data.user;
};

export const createUser = async ({
  name,
  email,
  password,
}) => {
  const response = await axiosInstance.post("/api/users", {
    name,
    email,
    password,
  });

  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axiosInstance.patch(
    `/api/users/${id}`,
    data
  );

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(
    `/api/users/${id}`
  );

  return response.data;
};