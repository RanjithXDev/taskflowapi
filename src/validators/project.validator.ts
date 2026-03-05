import { body } from "express-validator";
import { sanitizeInput } from "../utils/sanitize";
import { IsValidObjectId } from "./custom.validator";

export const createProjectValidator = [

  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Project title must be 3-100 characters")
    .customSanitizer(sanitizeInput),

  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description must be under 2000 characters")
    .customSanitizer(sanitizeInput),

  body("owner")
    .optional()
    .custom(IsValidObjectId)

];

export const updateProjectValidator = [

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Project title must be 3-100 characters"),

  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description must be under 2000 characters")

];