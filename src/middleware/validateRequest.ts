import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError";

const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    const formattedErrors = errors.array().map((err: any) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return next(
      new AppError(
        "Validation failed",
        400,
        formattedErrors
      )
    );
  }

  next();
};

export default validateRequest;