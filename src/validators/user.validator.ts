import { body, param } from "express-validator";
import { sanitizeInput } from "../utils/sanitize";
import { IsValidObjectId } from "./custom.validator";

export const userIdValidator = [

  param("id")
    .custom(IsValidObjectId)
    .withMessage("Invalid user ID")

];

export const createUserValidator = [

  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .customSanitizer(sanitizeInput),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be USER or ADMIN")

];


export const updateUserValidator = [

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters")
    .customSanitizer(sanitizeInput),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be USER or ADMIN")

];