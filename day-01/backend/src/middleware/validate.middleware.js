const validateCreateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, email and password are required");
    error.statusCode = 400;

    return next(error);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    const error = new Error("Invalid email format");
    error.statusCode = 400;

    return next(error);
  }

  next();
};

export default validateCreateUser;