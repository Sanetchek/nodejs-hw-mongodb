import express from "express";
import cors from "cors";
import {
  env
} from "./utils/env.js";
import authRouter from "./routers/auth.js";
import contactsRouter from "./routers/contacts.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import cookieParser from "cookie-parser";
import swaggerDocs from "./middlewares/swaggerDocs.js";

export const setupServer = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(logger);
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static("uploads"));

  // Routes
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);
  app.use('/api-docs', swaggerDocs());

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  // Port setup
  const port = Number(env("PORT", 3000));

  // Server listen
  app.listen(port, (err) => {
    if (err) {
      console.error(`Error starting server: ${err.message}`);
    } else {
      console.log(`Server started on port ${port}`);
    }
  });
};
