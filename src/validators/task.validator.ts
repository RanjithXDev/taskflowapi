import { body } from "express-validator";
import {sanitizeInput} from '../utils/sanitize';

import { isFutureDate , IsValidObjectId ,  projectExists, validateTags, userExist} from "./custom.validator";

export const createTaskValidator = [
    body("title")
    .trim().
    isLength({min:3, max:100})
    .withMessage("Title must be in range of 3-100")
    .customSanitizer(sanitizeInput),

    body("description")
    .isLength({max:2000})
    .withMessage("Description must be in the 2000 characters")
    .customSanitizer(sanitizeInput),

    body("priority")
    .isIn(["low", "medium" , "high", "urgent", "LOW", "MEDIUM", "HIGH", "URGENT"])
    .withMessage("priority  must be low ,medium ,high"),

    body("status")
    .optional()
    .isIn(["todo", "in-progress", "review" , "done"])
    .withMessage("Invalid status"),

    body("project")
    .custom(IsValidObjectId)
    .bail().custom(projectExists),

    body("assignee")
    .optional()
    .custom(IsValidObjectId)
    .bail().custom(userExist),

    body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .custom(isFutureDate),

    body("tags")
    .optional()
    .custom(validateTags)

]

export const updateTaskValidator = [

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters")
    .customSanitizer(sanitizeInput),

  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description must be under 2000 characters")
    .customSanitizer(sanitizeInput),

  body("priority")
    .optional()
    .isIn(["low", "medium" , "high", "urgent"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "review" , "done"])
    .withMessage("Invalid status value"),

  body("project")
    .optional()
    .custom(IsValidObjectId)
    .bail()
    .custom(projectExists),

  body("assignee")
    .optional()
    .custom(IsValidObjectId)
    .bail()
    .custom(userExist),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .custom(isFutureDate),

  body("tags")
    .optional()
    .custom(validateTags)

];