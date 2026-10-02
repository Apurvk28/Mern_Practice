import { createUserService } from "../services/user.service.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await createUserService({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};