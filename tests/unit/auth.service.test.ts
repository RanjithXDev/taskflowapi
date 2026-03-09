/**
 * Comprehensive unit tests for AuthService
 */
import { AuthService } from "../../src/services/auth.services";
import { User } from "../../src/models/User";
import * as jwtUtils from "../../src/utils/jwt";

jest.mock("../../src/models/User");
jest.mock("../../src/utils/jwt");
jest.mock("../../src/services/email.services", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined)
}));

describe("AuthService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- login ---
  describe("login", () => {
    it("throws 401 for unknown email", async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(
        AuthService.login("bad@test.com", "password")
      ).rejects.toThrow();
    });

    it("throws 401 for wrong password", async () => {
      const fakeUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(fakeUser)
      });

      await expect(
        AuthService.login("test@test.com", "wrongpass")
      ).rejects.toThrow();
    });

    it("returns tokens on successful login", async () => {
      const fakeUser = {
        id: "user123",
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(fakeUser)
      });
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue("access-token");
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");

      const result = await AuthService.login("test@test.com", "correct-pass");

      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBe("refresh-token");
    });
  });

  // --- signup ---
  describe("signup", () => {
    it("creates user with verification token", async () => {
      const fakeUser = { id: "123" };
      (User.create as jest.Mock).mockResolvedValue(fakeUser);
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue("access-token");
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue("refresh-token");

      const result = await AuthService.signup({
        name: "Test",
        email: "test@test.com",
        password: "password123"
      });

      expect(result.user).toEqual(fakeUser);
      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBe("refresh-token");
      expect(result.verificationToken).toBeDefined();
    });
  });

  // --- refresh ---
  describe("refresh", () => {
    it("generates new access token from refresh token", async () => {
      (jwtUtils.verifyRefreshToken as jest.Mock).mockReturnValue({ userId: "123" });
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue("new-access");

      const result = await AuthService.refresh("valid-refresh-token");

      expect(result.accessToken).toBe("new-access");
    });
  });

  // --- forgotPassword ---
  describe("forgotPassword", () => {
    it("throws if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.forgotPassword("no@test.com")
      ).rejects.toThrow();
    });

    it("returns reset link if user found", async () => {
      const fakeUser = {
        generateResetToken: jest.fn().mockReturnValue("reset-token"),
        save: jest.fn()
      };
      (User.findOne as jest.Mock).mockResolvedValue(fakeUser);

      const result = await AuthService.forgotPassword("test@test.com");

      expect(result).toContain("reset-token");
      expect(fakeUser.save).toHaveBeenCalled();
    });
  });

  // --- resetPassword ---
  describe("resetPassword", () => {
    it("throws error for invalid/expired token", async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(
        AuthService.resetPassword("bad-token", "newpass")
      ).rejects.toThrow("Token invalid or expired");
    });

    it("updates password for valid token", async () => {
      const fakeUser = {
        password: "old",
        resetToken: undefined,
        resetTokenExp: undefined,
        save: jest.fn()
      };
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(fakeUser)
      });

      const result = await AuthService.resetPassword("valid-token", "newpassword");

      expect(fakeUser.save).toHaveBeenCalled();
      expect(fakeUser.password).toBe("newpassword");
      expect(result).toBe(true);
    });
  });

  // --- uploadAvatar ---
  describe("uploadAvatar", () => {
    it("throws 404 if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.uploadAvatar("bad-id", { filename: "avatar.jpg" })
      ).rejects.toThrow("User not found");
    });

    it("updates avatar and returns filename", async () => {
      const fakeUser: any = {
        avatar: undefined,
        save: jest.fn()
      };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      const result = await AuthService.uploadAvatar("user-id", { filename: "avatar.png" });

      expect(fakeUser.avatar).toBe("avatar.png");
      expect(fakeUser.save).toHaveBeenCalled();
      expect(result).toBe("avatar.png");
    });
  });
});