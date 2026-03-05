import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let token: string | undefined;

  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.redirect("/login");
  }

  try {

    const decoded: any = verifyAccessToken(token);

    (req as any).userId = decoded.userId;

    next();

  } catch {

    return res.redirect("/login");

  }

};