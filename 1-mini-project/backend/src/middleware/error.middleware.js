const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid task ID";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  if (err.name === "StrictModeError") {
    statusCode = 400;
    message = "Invalid field in request";
  }

  res.status(statusCode).json({
    message,
  });
};

export default errorHandler;
