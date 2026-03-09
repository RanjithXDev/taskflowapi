/**
 * Unit tests for auth controller functions
 */
jest.mock("../../src/services/auth.services");
jest.mock("../../src/services/email.services", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined)
}));
jest.mock("../../src/models/User");
jest.mock("crypto", () => ({
  ...jest.requireActual("crypto"),
  randomBytes: jest.fn().mockReturnValue({ toString: jest.fn().mockReturnValue("mock-token-hex") })
}));

import { signup, login, logout, refresh, me, uploadAvatar, forgotPassword, resetPassword } from "../../src/controllers/auth.controller";
import { AuthService } from "../../src/services/auth.services";
import { User } from "../../src/models/User";

describe("Auth Controller", () => {

  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {}, headers: {}, cookies: {}, protocol: "http", get: jest.fn().mockReturnValue("localhost:3000") };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      render: jest.fn()
    };
    next = jest.fn();
  });

  describe("signup", () => {
    it("returns 400 when user creation fails", async () => {
      (AuthService.signup as jest.Mock).mockResolvedValue({ user: null, accessToken: null, refreshToken: null });

      await signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("creates user and sends verification email on success", async () => {
      const mockUser: any = {
        id: "user-id",
        email: "test@test.com",
        verificationToken: undefined,
        verified: undefined,
        save: jest.fn()
      };
      (AuthService.signup as jest.Mock).mockResolvedValue({
        user: mockUser,
        accessToken: "access",
        refreshToken: "refresh"
      });

      await signup(req, res, next);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("sets avatar from uploaded file", async () => {
      const mockUser: any = {
        id: "user-id",
        email: "test@test.com",
        verificationToken: undefined,
        verified: undefined,
        save: jest.fn()
      };
      req.file = { filename: "avatar.jpg" };
      (AuthService.signup as jest.Mock).mockResolvedValue({
        user: mockUser,
        accessToken: "access",
        refreshToken: "refresh"
      });

      await signup(req, res, next);

      expect(req.body.avatar).toBe("avatar.jpg");
    });

    it("calls next on error", async () => {
      (AuthService.signup as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await signup(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("returns 401 when user not found after login", async () => {
      (AuthService.login as jest.Mock).mockResolvedValue({ accessToken: "token" });
      (User.findOne as jest.Mock).mockResolvedValue(null);

      req.body = { email: "no@test.com", password: "pass" };
      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("sets cookie and returns tokens on successful login", async () => {
      const mockUser = { email: "user@test.com", verified: true };
      (AuthService.login as jest.Mock).mockResolvedValue({ accessToken: "acc", refreshToken: "ref" });
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      req.body = { email: "user@test.com", password: "correct" };
      await login(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith("token", "acc", expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ verified: true }));
    });

    it("calls next on login error", async () => {
      (AuthService.login as jest.Mock).mockRejectedValue(new Error("Invalid"));

      await login(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("clears cookie and returns success message", () => {
      logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith("token", expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
    });
  });

  describe("refresh", () => {
    it("returns new access token", async () => {
      (AuthService.refresh as jest.Mock).mockResolvedValue({ accessToken: "new-token" });
      req.body = { refreshToken: "old-refresh" };

      await refresh(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ accessToken: "new-token" });
    });

    it("calls next on refresh error", async () => {
      (AuthService.refresh as jest.Mock).mockRejectedValue(new Error("Invalid token"));

      await refresh(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("me", () => {
    it("returns current user", async () => {
      const mockUser = { _id: "user-id", name: "Test" };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      req.userId = "user-id";

      await me(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("user-id");
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("calls next on error", async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error("DB Error"));
      req.userId = "user-id";

      await me(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("uploadAvatar", () => {
    it("returns 400 when no file is uploaded", async () => {
      req.file = undefined;

      await uploadAvatar(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No file uploaded" });
    });

    it("calls AuthService.uploadAvatar and returns result", async () => {
      req.file = { filename: "new-avatar.png" };
      req.userId = "user-id";
      (AuthService.uploadAvatar as jest.Mock).mockResolvedValue("new-avatar.png");

      await uploadAvatar(req, res, next);

      expect(AuthService.uploadAvatar).toHaveBeenCalledWith("user-id", req.file);
      expect(res.json).toHaveBeenCalledWith({
        message: "Avatar uploaded successfully",
        avatar: "new-avatar.png"
      });
    });
  });

  describe("forgotPassword", () => {
    it("returns 404 when user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      req.body = { email: "no@test.com" };

      await forgotPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("sends reset email if user found", async () => {
      const mockUser: any = {
        email: "user@test.com",
        generateResetToken: jest.fn().mockReturnValue("reset-token"),
        save: jest.fn()
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      req.body = { email: "user@test.com" };

      await forgotPassword(req, res, next);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Password reset email sent" });
    });
  });

  describe("resetPassword", () => {
    it("calls AuthService.resetPassword and returns success", async () => {
      (AuthService.resetPassword as jest.Mock).mockResolvedValue(true);
      req.params = { token: "valid-token" };
      req.body = { password: "newpass123" };

      await resetPassword(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ message: "Password updated successfully" });
    });

    it("calls next on error", async () => {
      (AuthService.resetPassword as jest.Mock).mockRejectedValue(new Error("Expired token"));
      req.params = { token: "bad" };
      req.body = { password: "pass" };

      await resetPassword(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
