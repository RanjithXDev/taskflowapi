import { body, param } from "express-validator";
import { sanitizeInput } from "../utils/sanitize";
import { IsValidObjectId } from "./custom.validator";


export const commentIdValidator = [
  param("id")
    .custom(IsValidObjectId)
    .withMessage("Invalid comment ID")
];


export const createCommentValidator = [

  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters")
    .customSanitizer(sanitizeInput),

  body("task")
    .custom(IsValidObjectId)
    .withMessage("Invalid task ID"),

  body("author")
    .optional()
    .custom(IsValidObjectId)
    .withMessage("Invalid author ID")
];

export const updateCommentValidator = [

  body("content")
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters")
    .customSanitizer(sanitizeInput)

];