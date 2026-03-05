import { Request, Response, NextFunction } from "express";

export const isOwnerOrAdmin = (
  req: any,
  res: Response,
  next: NextFunction
) => {

  const userId = req.userId;

  if (
    req.params.id === userId ||
    req.user?.role === "admin"
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Not authorized"
  });

};