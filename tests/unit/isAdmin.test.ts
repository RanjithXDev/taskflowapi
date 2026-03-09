/**
 * Comprehensive unit tests for isAdmin middleware
 */
import { isAdmin } from "../../src/middleware/isAdmin";
import { User } from "../../src/models/User";

jest.mock("../../src/models/User");

describe("isAdmin middleware", () => {

  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { userId: "user-id" };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("calls next() when user is admin", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ role: "admin" });

    await isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 403 when user has role 'user'", async () => {
    (User.findById as jest.Mock).mockResolvedValue({ role: "user" });

    await isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Admin only" }));
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when user not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("uses userId from request", async () => {
    req.userId = "specific-user-id";
    (User.findById as jest.Mock).mockResolvedValue({ role: "admin" });

    await isAdmin(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("specific-user-id");
  });
});