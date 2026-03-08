import { Router } from "express";

import {  signup,  login,  logout,  refresh,  forgotPassword,  resetPassword,me} from "../controllers/auth.controller";
import { signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from "../validators/auth.validator";
import validateRequest from "../middleware/validateRequest";
import { isAuth } from "../middleware/isAuth";
import { authLimiter } from "../config/rateLimiter";
import { avatarUpload } from "../config/avatarUpload";
import { uploadAvatar, verifyEmail } from "../controllers/auth.controller";
const router = Router();
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/signup",avatarUpload.single("avatar"), authLimiter, signupValidator, validateRequest, signup);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 */
router.post("/login", authLimiter, loginValidator, validateRequest, login);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user and clear the cookies
 *     tags: [Auth]
 */
router.post("/logout", logout);
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post("/refresh", refresh);
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 */
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validateRequest, forgotPassword);
/**
 * @swagger
 * /api/auth/me/avatar:
 *   put:
 *     summary: Upload user avatar
 *     tags: [Auth]
 */
router.put("/me/avatar", isAuth,  avatarUpload.single("avatar"), uploadAvatar);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 */
router.post("/reset-password/:token", resetPasswordValidator, validateRequest, resetPassword);
/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 */
router.get("/verify-email/:token", verifyEmail);
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Auth]
 */
router.get("/me", isAuth, me);

export default router;