"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth_1 = require("../../src/middleware/isAuth");
const jwtUtils = __importStar(require("../../src/utils/jwt"));
jest.mock("../../src/utils/jwt");
describe("isAuth middleware", () => {
    let req;
    let res;
    let next;
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
        jwtUtils.verifyAccessToken
            .mockReturnValue({ userId: "123" });
        (0, isAuth_1.isAuth)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.userId).toBe("123");
    });
    it("returns 401 for missing token", () => {
        (0, isAuth_1.isAuth)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalled();
    });
    it("returns 401 for expired token", () => {
        req.headers.authorization = "Bearer expired";
        jwtUtils.verifyAccessToken
            .mockImplementation(() => {
            throw new Error("TokenExpiredError");
        });
        (0, isAuth_1.isAuth)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalled();
    });
    it("returns 401 for invalid token", () => {
        req.headers.authorization = "Bearer invalid";
        jwtUtils.verifyAccessToken
            .mockImplementation(() => {
            throw new Error("Invalid token");
        });
        (0, isAuth_1.isAuth)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalled();
    });
});
