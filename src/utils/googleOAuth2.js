import { OAuth2Client } from "google-auth-library";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

import { env } from "./env.js";
import createHttpError from "http-errors";

const clientId = env("GOOGLE_AUTH_CLIENT_ID");
const clientSecret = env("GOOGLE_AUTH_CLIENT_SECRET");
const isDevUriEnabled = env("ENABLE_GOOGLE_REDIRECT_DEV_URI");

const oauthConfigPath = path.resolve("google-oauth.json");
const oauthConfig = JSON.parse(await readFile(oauthConfigPath, "utf-8"));
let redirectUri = oauthConfig.web.redirect_uris[1];

if (isDevUriEnabled === 'true') {
  redirectUri = oauthConfig.web.redirect_uris[0];
}

const googleOAuthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri,
});

export const validateCode = async code => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401, "Google Code is invalid");
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token
  });

  return ticket;
};

export const generateGoogleOAuthUrl = () => {
  const url = googleOAuthClient.generateAuthUrl({
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ]
  });

  return url;
}
