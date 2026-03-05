import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.services";
import { User } from "../models/User";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const result =
      await AuthService.signup(req.body);

    res.status(201).json(result);

  } catch (error) {
    next(error);
  }

};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { email, password } = req.body;

    const result =
      await AuthService.login(email, password);
      res.cookie("token", result.accessToken, {
      httpOnly: true,
      sameSite: "lax"
    });
    res.json(result);

  } catch (error) {
    next(error);
  }

};
export const logout = (
  req: Request,
  res: Response
) => {

  res.clearCookie("token");

  res.json({
    message: "Logged out successfully"
  });

};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { refreshToken } = req.body;

    const token =
      await AuthService.refresh(refreshToken);

    res.json(token);

  } catch (error) {
    next(error);
  }

};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const link =
      await AuthService.forgotPassword(req.body.email);

    res.json({ resetLink: link });

  } catch (error) {
    next(error);
  }

};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    await AuthService.resetPassword(
      req.params.token as any,
      req.body.password
    );

    res.json({ message: "Password updated" });

  } catch (error) {
    next(error);
  }

};

export const me = async (
  req: any,
  res: Response
) => {

  const user =
    await User.findById(req.userId);

  res.json(user);

};