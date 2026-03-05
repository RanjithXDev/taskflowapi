import { isAdmin } from "../../src/middleware/isAdmin";
import { User } from "../../src/models/User";

jest.mock("../../src/models/User");

describe("isAdmin middleware", () => {

  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {

    req = { userId: "1" };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();

  });

  it("passes for admin role", async () => {

    (User.findById as jest.Mock)
      .mockResolvedValue({ role: "admin" });

    await isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();

  });

  it("returns 403 for regular user role", async () => {

    (User.findById as jest.Mock)
      .mockResolvedValue({ role: "user" });

    await isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);

  });

});