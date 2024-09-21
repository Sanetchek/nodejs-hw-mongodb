import {
  HttpError
} from "http-errors";

const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
      data: error.expose ? error.message : "An error occurred",
    });
  }

  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  res.status(status).json({
    status,
    message: "Something went wrong",
    data: message,
  });
};

export default errorHandler;
