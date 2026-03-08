"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../../src/utils/AppError");
describe("AppError", () => {
    test("should create error with message and statusCode", () => {
        const error = new AppError_1.AppError("Test error", 400);
        expect(error.message).toBe("Test error");
        expect(error.statusCode).toBe(400);
    });
    test("should include validation errors array", () => {
        const errors = [{ field: "title", message: "Required" }];
        const error = new AppError_1.AppError("Validation failed", 400, errors);
        expect(error.errors).toEqual(errors);
    });
});
