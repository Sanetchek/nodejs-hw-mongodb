import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { randomBytes } from "crypto";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import handlebars from "handlebars";

import userCollection from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/users.js";

import sendEmail from "../utils/sendEmail.js";
import "dotenv/config";
const {
  APP_DOMAIN
} = process.env;
import { createJwtToken, verifyToken } from "../utils/jwt.js";
import {
  TEMPLATES_DIR
} from "../constants/index.js";

const resetPasswordEmailPath = path.join(TEMPLATES_DIR, "reset-password-email.html");
const resetPasswordEmailTemplateSource = await fs.readFile(resetPasswordEmailPath, "utf-8");

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil
  }
}

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await userCollection.create({
    ...payload,
    password: hashPassword
  });
  delete data._doc.password;

  return data._doc;
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, "Email or password invalid!");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, "Email or password invalid!");
  }

  // Delete the old session
  await SessionCollection.deleteOne({
    userId: user._id
  });

  // Create a new session
  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData
  });

  return userSession;
}

export const findSessionByAccessToken = (accessToken) => SessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  // Validate cookies
  if (!refreshToken || !sessionId) {
    throw createHttpError(400, "Refresh token or session ID missing");
  }

  // Find the old session
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken
  });

  if (!oldSession) {
    throw createHttpError(401, "Session not found");
  }

  // Validate token expiry
  const tokenExpiry = new Date(oldSession.refreshTokenValidUntil);
  if (new Date() > tokenExpiry) {
    throw createHttpError(401, "Session token expired");
  }

  // Delete the old session
  await SessionCollection.deleteOne({
    _id: sessionId
  });

  // Create a new session
  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData
  });

  return userSession;
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({
    _id: sessionId
  });
}

export const findUser = (filter) => userCollection.findOne(filter);

export const sendResetEmail = async (payload) => {
  const {
    email
  } = payload;

  // Find the user by email
  const user = await userCollection.findOne({
    email
  });

  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  // Create the JWT token for further security or email usage
  const jwtToken = createJwtToken({
    email
  });

  // Compile the email template and insert the new password
  const template = handlebars.compile(resetPasswordEmailTemplateSource);
  const html = template({
    APP_DOMAIN,
    jwtToken
  });

  // Create email data object
  const emailData = {
    to: email,
    subject: "Your New Password for ContactsApp!",
    html
  };

  // Send the email with the new password
  const resetPasswordEmail = await sendEmail(emailData);

  if (!resetPasswordEmail) {
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }

  return resetPasswordEmail;
};

export const resetPassword = async (token, password) => {
  const { data, error } = verifyToken(token);

  if (error) {
    throw createHttpError(401, "Token is expired or invalid.");
  }

  const user = await userCollection.findOne({
    email: data.email
  });

  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const userUpdated = await userCollection.findOneAndUpdate({
    _id: user.id
  }, {
    password: hashPassword
  });

  return userUpdated;
};
