import User from "../models/user.model.js";

export const createUserService = async ({
  name,
  email,
  password,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;

    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

export const getUsersService = async (search = "") => {
  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  const users = await User.find(filter);

  return users;
};

export const getUserByIdService = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;

    throw error;
  }

  return user;
};

export const updateUserService = async (id, data) => {
  if (data.email) {
    const existingUser = await User.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 409;

      throw error;
    }
  }

  const user = await User.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;

    throw error;
  }

  return user;
};

export const deleteUserService = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;

    throw error;
  }

  return user;
};