import { Router } from "express";

import {  signup,  login,  logout,  refresh,  forgotPassword,  resetPassword,me} from "../controllers/auth.controller";
import { signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from "../validators/auth.validator";
import validateRequest from "../middleware/validateRequest";
import { isAuth } from "../middleware/isAuth";
import { authLimiter } from "../config/rateLimiter";

const router = Router();

router.post("/signup", authLimiter, signupValidator, validateRequest, signup);

router.post("/login", authLimiter, loginValidator, validateRequest, login);
router.post("/logout", logout);

router.post("/refresh", refresh);

router.post("/forgot-password", authLimiter, forgotPasswordValidator, validateRequest, forgotPassword);

router.post("/reset-password/:token", resetPasswordValidator, validateRequest, resetPassword);

router.get("/me", isAuth, me);

export default router;