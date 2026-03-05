import bcrypt from "bcryptjs";
import { AuthService } from "../../src/services/auth.services";
import { User } from "../../src/models/User";
import * as jwtUtils from "../../src/utils/jwt";

jest.mock("../../src/models/User");
jest.mock("../../src/utils/jwt");

describe("AuthService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  

  it("throws 401 for wrong email", async () => {

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      AuthService.login("wrong@test.com", "password")
    ).rejects.toThrow();

  });

  it("throws 401 for wrong password", async () => {

    (User.findOne as jest.Mock).mockResolvedValue({
      comparePassword: jest.fn().mockResolvedValue(false)
    });

    await expect(
      AuthService.login("test@test.com", "wrongpass")
    ).rejects.toThrow();

  });

  
  it("signup returns access token", async () => {

    (User.create as jest.Mock).mockResolvedValue({
      id: "123"
    });

    (jwtUtils.generateAccessToken as jest.Mock)
      .mockReturnValue("token123");

    const result = await AuthService.signup({
      name: "Test",
      email: "test@test.com",
      password: "123456"
    });

    expect(result.accessToken).toBeDefined();

  });

  

  it("refresh generates new access token", async () => {

    (jwtUtils.verifyRefreshToken as jest.Mock)
      .mockReturnValue({ userId: "123" });

    (jwtUtils.generateAccessToken as jest.Mock)
      .mockReturnValue("newToken");

    const result = await AuthService.refresh("refreshToken");

    expect(result.accessToken).toBe("newToken");

  });

  

  it("forgotPassword throws error if user not found", async () => {

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      AuthService.forgotPassword("no@test.com")
    ).rejects.toThrow();

  });

  
  it("resetPassword throws error for invalid token", async () => {

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      AuthService.resetPassword("badtoken", "123456")
    ).rejects.toThrow();

  });

});