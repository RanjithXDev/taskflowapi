import { errorHandler } from "../../src/middleware/errorhandler";

describe("Error Handler", () => {

  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  test("Mongoose ValidationError returns 400", () => {

    const err = {
      name: "ValidationError",
      errors: {
        title: { path: "title", message: "Title required" }
      }
    };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(400);

  });

  test("CastError returns 400", () => {

    const err = { name: "CastError" };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(400);

  });

  test("duplicate key error returns 409", () => {

    const err = {
      code: 11000,
      keyValue: { email: "test@test.com" }
    };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(409);

  });

  test("JWT expired returns 401", () => {

    const err = { name: "TokenExpiredError" };

    errorHandler(err, {} as any, mockRes, {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(401);

  });

});