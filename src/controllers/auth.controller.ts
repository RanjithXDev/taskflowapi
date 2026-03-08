import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AuthService } from "../services/auth.services";
import { User } from "../models/User";
import { sendEmail } from "../services/email.services";


export const signup = async (
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
) => {

  try {

    const data: any = req.body;

    if (req.file) {
      data.avatar = req.file.filename;
    }

    const result = await AuthService.signup(data);

    const user = result.user;

    if (!user) {
      return res.status(400).json({
        message: "User creation failed"
      });
    }

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    user.verificationToken = verificationToken;
    user.verified = false;

    await user.save();

    const verifyLink =
      `${req.protocol}://${req.get("host")}/api/auth/verify-email/${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify your account",
      `
      <h2>Email Verification</h2>
      <p>Please click below to verify your account</p>
      <a href="${verifyLink}">Verify Email</a>
      <p>If the button does not work copy this link:</p>
      <p>${verifyLink}</p>
      `
    );

    res.status(201).json({
      message: "Account created successfully. Please verify your email.",
      user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

  } catch (error) {
    console.error("Signup error:", error);
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    res.cookie("token", result.accessToken, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.json({
      ...result,
      verified: user.verified
    });

  } catch (error) {
    next(error);
  }

};



export const logout = (
  req: Request,
  res: Response
) => {

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax"
  });

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



export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token
    });

    if (!user) {
      return res.render("verification", {
        success: false,
        message: "Invalid verification link"
      });
    }

    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.render("verification-result", {
      success: true,
      message: "Email verified successfully"
    });

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

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const token = user.generateResetToken();

    await user.save();

    const resetLink =
      `${req.protocol}://${req.get("host")}/reset/${token}`;

    await sendEmail(
      user.email,
      "Reset your password",
      `
      <h3>Password Reset</h3>
      <p>Click below to reset your password</p>
      <a href="${resetLink}">Reset Password</a>

      <p>If the button doesn't work copy this link:</p>
      <p>${resetLink}</p>
      `
    );

    res.json({
      message: "Password reset email sent"
    });

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

    const { token } = req.params;
    const { password } = req.body;

    await AuthService.resetPassword(
      token as any,
      password
    );

    res.json({
      message: "Password updated successfully"
    });

  } catch (error) {
    next(error);
  }

};



export const me = async (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) => {

  try {

    const user = await User.findById(req.userId);

    res.json(user);

  } catch (error) {
    next(error);
  }

};



export const uploadAvatar = async (
  req: Request & { userId?: string; file?: Express.Multer.File },
  res: Response,
  next: NextFunction
) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const avatar =
      await AuthService.uploadAvatar(
        req.userId as string,
        req.file
      );

    res.json({
      message: "Avatar uploaded successfully",
      avatar
    });

  } catch (error) {
    next(error);
  }

};