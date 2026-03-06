import { Router } from "express";

import {  signup,  login,  logout,  refresh,  forgotPassword,  resetPassword,me} from "../controllers/auth.controller";
import { signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from "../validators/auth.validator";
import validateRequest from "../middleware/validateRequest";
import { isAuth } from "../middleware/isAuth";
import { authLimiter } from "../config/rateLimiter";
import { avatarUpload } from "../config/avatarUpload";
import { uploadAvatar } from "../controllers/auth.controller";
const router = Router();

router.post("/signup",avatarUpload.single("avatar"), authLimiter, signupValidator, validateRequest, signup);

router.post("/login", authLimiter, loginValidator, validateRequest, login);
router.post("/logout", logout);

router.post("/refresh", refresh);

router.post("/forgot-password", authLimiter, forgotPasswordValidator, validateRequest, forgotPassword);
router.put("/me/avatar", isAuth,  avatarUpload.single("avatar"), uploadAvatar);
router.post("/reset-password/:token", resetPasswordValidator, validateRequest, resetPassword);

router.get("/me", isAuth, me);

export default router;