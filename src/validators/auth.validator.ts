import { body } from "express-validator";
import { sanitizeInput } from "../utils/sanitize";

export const signupValidator = [

  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters")
    .customSanitizer(sanitizeInput),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")

];

export const loginValidator = [

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")

];

export const forgotPasswordValidator = [

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()

];

export const resetPasswordValidator = [

  

  body("password")
  .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

   body("newPassword")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")

];