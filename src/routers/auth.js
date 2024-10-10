import {
  Router
} from "express";

import * as authControllers from '../controllers/auth.js';

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import {
  userLoginSchema,
  userRegisterSchema,
  emailSchema,
  resetPasswordSchema,
  userLoginWithGoogleOAuthSchema
} from "../validation/users.js";

const authRouter = Router();

authRouter.post('/register', validateBody(userRegisterSchema), ctrlWrapper(authControllers.registerController));

authRouter.get('/google-oauth-url', ctrlWrapper(authControllers.getGoogleOAuthUrlController));

authRouter.post('/confirm-google', validateBody(userLoginWithGoogleOAuthSchema), ctrlWrapper(authControllers.loginWithGoogleOAuthController));

authRouter.post('/login', validateBody(userLoginSchema), ctrlWrapper(authControllers.loginController));

authRouter.post('/refresh', ctrlWrapper(authControllers.refrehController));

authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));

authRouter.post('/send-reset-email', validateBody(emailSchema), ctrlWrapper(authControllers.sendResetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(authControllers.resetPasswordController));

export default authRouter;
