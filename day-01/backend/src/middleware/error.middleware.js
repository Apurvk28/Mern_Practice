const errorHandler = (err, req, res, next) => {
  console.error(err);
  console.log("ERROR NAME:", err.name);

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Something went wrong",
  });
};

export default errorHandler;