import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message
    }));
    message = "Validation error";
  }

 
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  res.status(statusCode).json({
    status: "fail",
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};