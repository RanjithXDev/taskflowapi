"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_1 = require("../src/middleware/errorhandler");
const AppError_1 = require("../src/utils/AppError");
describe('Error Handler Unit Tests', () => {
    it('should preserve custom error status code', () => {
        const error = new AppError_1.AppError('Custom error', 400);
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        (0, errorhandler_1.errorHandler)(error, req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it('should return 500 for unknown errors', () => {
        const error = new Error('Unknown error');
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        (0, errorhandler_1.errorHandler)(error, req, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
