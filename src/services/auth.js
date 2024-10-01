import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { randomBytes } from "crypto";

import userCollection from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/users.js";

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

  const hashPassword = await bcrypt.hash(password, 10)

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

export const refreshSession = async ({
  refreshToken,
  sessionId
}) => {
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
