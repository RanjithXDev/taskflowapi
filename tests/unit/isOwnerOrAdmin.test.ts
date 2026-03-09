/**
 * Unit tests for isOwnerOrAdmin middleware
 */
import { isOwnerOrAdmin } from "../../src/middleware/isOwnerOrAdmin";

describe("isOwnerOrAdmin middleware", () => {

  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { userId: "user-id", params: {}, user: undefined };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("calls next when userId matches params.id (owner)", () => {
    req.userId = "user-123";
    req.params = { id: "user-123" };

    isOwnerOrAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("calls next when user role is admin", () => {
    req.userId = "admin-id";
    req.params = { id: "other-user-id" };
    req.user = { role: "admin" };

    isOwnerOrAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 403 when userId does not match and not admin", () => {
    req.userId = "user-1";
    req.params = { id: "user-2" };
    req.user = { role: "user" };

    isOwnerOrAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when no user attached", () => {
    req.userId = "user-1";
    req.params = { id: "user-2" };
    req.user = undefined;

    isOwnerOrAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
