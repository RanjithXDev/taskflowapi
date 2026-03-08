"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = require("../../src/middleware/errorhandler");
describe("Error Handler", () => {
    const mockRes = {
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
        (0, errorhandler_1.errorHandler)(err, {}, mockRes, {});
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });
    test("CastError returns 400", () => {
        const err = { name: "CastError" };
        (0, errorhandler_1.errorHandler)(err, {}, mockRes, {});
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });
    test("duplicate key error returns 409", () => {
        const err = {
            code: 11000,
            keyValue: { email: "test@test.com" }
        };
        (0, errorhandler_1.errorHandler)(err, {}, mockRes, {});
        expect(mockRes.status).toHaveBeenCalledWith(409);
    });
    test("JWT expired returns 401", () => {
        const err = { name: "TokenExpiredError" };
        (0, errorhandler_1.errorHandler)(err, {}, mockRes, {});
        expect(mockRes.status).toHaveBeenCalledWith(401);
    });
});
