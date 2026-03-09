/**
 * Comprehensive unit tests for errorHandler middleware
 */
import { errorHandler } from "../../src/middleware/errorhandler";
import { AppError } from "../../src/utils/AppError";

describe("Error Handler Middleware", () => {

  let mockRes: any;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("returns 500 for generic errors", () => {
    const err = new Error("Something went wrong");

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "fail", message: "Something went wrong" })
    );
  });

  it("uses err.statusCode when present", () => {
    const err: any = new Error("Not found");
    err.statusCode = 404;

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  it("returns 400 for Mongoose ValidationError", () => {
    const err = {
      name: "ValidationError",
      errors: {
        title: { path: "title", message: "Title is required" },
        priority: { path: "priority", message: "Priority is required" }
      }
    };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Validation error",
        errors: expect.arrayContaining([
          expect.objectContaining({ field: "title" })
        ])
      })
    );
  });

  it("returns 400 for CastError", () => {
    const err = { name: "CastError" };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid ID format" })
    );
  });

  it("returns 409 for duplicate key error (code 11000)", () => {
    const err = {
      code: 11000,
      keyValue: { email: "test@example.com" }
    };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "email already exists" })
    );
  });

  it("returns 401 for TokenExpiredError", () => {
    const err = { name: "TokenExpiredError" };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Token expired" })
    );
  });

  it("returns 401 for JsonWebTokenError", () => {
    const err = { name: "JsonWebTokenError" };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid token" })
    );
  });

  it("uses default 500 when no statusCode set", () => {
    const err: any = {};

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Internal Server Error" })
    );
  });

  it("does not include stack in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const err = new Error("Prod error");
    errorHandler(err, {} as any, mockRes, {} as any);

    const jsonArg = mockRes.json.mock.calls[0][0];
    expect(jsonArg.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });

  it("handles AppError properly", () => {
    const err = new AppError("Custom error", 422, [{ field: "name", message: "Too short" }]);

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Custom error" })
    );
  });
});