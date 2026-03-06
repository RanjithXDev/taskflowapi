import { User } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../utils/jwt";
import bcrypt from "bcryptjs";
import { AppError} from "../utils/AppError";


export class AuthService {

  static async signup(data: any) {

    const user = await User.create(data);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken
    };

  }

  static async login(email: string, password: string) {

    const user = await User
      .findOne({ email })
      .select("+password");

    if (!user) {
      throw new AppError("Invalid email", 401);
    }

    const valid = await user.comparePassword(password);

    if (!valid) {
     throw new AppError("Invalid Password", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken
    };

  }

  static async refresh(refreshToken: string) {

    const payload: any =
      verifyRefreshToken(refreshToken);

    const accessToken =
      generateAccessToken(payload.userId);

    return { accessToken };

  }

  static async forgotPassword(email: string) {

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("user not found", 401);
    }

    const token = user.generateResetToken();

    await user.save();

    const resetLink =
      `http://localhost:3000/api/auth/reset-password/${token}`;

    return resetLink;

  }

  static async resetPassword(token: string, password: string) {

    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: new Date() }
    }).select("+password");

    if (!user) {
      throw new AppError("Token invalid or expired", 400);
    }
    
    user.password = password;
    
    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    await user.save();

    return true;

  }


  static async uploadAvatar(userId: string, file: any) {

  const user = await User.findById(userId);

  if (!user) {
    const err: any = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  user.avatar = file.filename;

  await user.save();

  return user.avatar;
}

}