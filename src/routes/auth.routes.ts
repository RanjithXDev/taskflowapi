import { Router } from "express";

import {
  signup,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  me
} from "../controllers/auth.controller";

import { isAuth } from "../middleware/isAuth";
import { authLimiter } from "../config/rateLimiter";

const router = Router();

router.post("/signup", authLimiter, signup);

router.post("/login", authLimiter, login);

router.post("/refresh", refresh);

router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/me", isAuth, me);

export default router;