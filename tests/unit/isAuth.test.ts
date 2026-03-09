/**
 * Unit tests for isAuth middleware
 */
import { isAuth } from "../../src/middleware/isAuth";
import * as jwtUtils from "../../src/utils/jwt";

jest.mock("../../src/utils/jwt");

describe("isAuth middleware", () => {

  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {}, cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("passes when valid Bearer token provided", () => {
    req.headers.authorization = "Bearer valid-token";
    (jwtUtils.verifyAccessToken as jest.Mock).mockReturnValue({ userId: "user-123" });

    isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe("user-123");
    expect(res.status).not.toHaveBeenCalled();
  });

  it("extracts token from cookie when no auth header", () => {
    req.cookies = { token: "cookie-token" };
    (jwtUtils.verifyAccessToken as jest.Mock).mockReturnValue({ userId: "user-456" });

    isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe("user-456");
  });

  it("returns 401 when no token provided", () => {
    isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is invalid", () => {
    req.headers.authorization = "Bearer bad-token";
    (jwtUtils.verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is expired", () => {
    req.headers.authorization = "Bearer expired-token";
    (jwtUtils.verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error("TokenExpiredError");
    });

    isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("prefers Authorization header over cookie", () => {
    req.headers.authorization = "Bearer header-token";
    req.cookies = { token: "cookie-token" };
    (jwtUtils.verifyAccessToken as jest.Mock).mockReturnValue({ userId: "header-user" });

    isAuth(req, res, next);

    expect(jwtUtils.verifyAccessToken).toHaveBeenCalledWith("header-token");
    expect(req.userId).toBe("header-user");
  });
});