import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e: any) => e.message);

    return res.status(400).json({
      status: "fail",
      message: "Validation error",
      errors
    });
  }
  if (err.name === "CastError") {
    const errors = Object.values(err.errors).map((e: any) => e.message);

    return res.status(404).json({
      status: "404",
      message: "Task Not Found"
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID format"
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message
    });
  }

  
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error"
  });

};