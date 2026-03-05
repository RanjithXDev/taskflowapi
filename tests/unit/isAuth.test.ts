import { isAuth } from "../../src/middleware/isAuth";
import * as jwtUtils from "../../src/utils/jwt";

jest.mock("../../src/utils/jwt");

describe("isAuth middleware", () => {

  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {

    req = {
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn()
    };

    next = jest.fn();

  });

  it("passes when valid JWT is provided", () => {

    req.headers.authorization = "Bearer validtoken";

    (jwtUtils.verifyAccessToken as jest.Mock)
      .mockReturnValue({ userId: "123" });

    isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe("123");

  });

  it("returns 401 for missing token", () => {

    isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();

  });

  it("returns 401 for expired token", () => {

    req.headers.authorization = "Bearer expired";

    (jwtUtils.verifyAccessToken as jest.Mock)
      .mockImplementation(() => {
        throw new Error("TokenExpiredError");
      });

    isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();

  });

  it("returns 401 for invalid token", () => {

    req.headers.authorization = "Bearer invalid";

    (jwtUtils.verifyAccessToken as jest.Mock)
      .mockImplementation(() => {
        throw new Error("Invalid token");
      });

    isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();

  });

});