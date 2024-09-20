const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  res.status(status).json({
    status,
    message: "Something went wrong",
    data: message
  });
};

export default errorHandler;
