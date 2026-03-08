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
const auth_services_1 = require("../../src/services/auth.services");
const User_1 = require("../../src/models/User");
const jwtUtils = __importStar(require("../../src/utils/jwt"));
jest.mock("../../src/models/User");
jest.mock("../../src/utils/jwt");
describe("AuthService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("throws 401 for wrong email", async () => {
        User_1.User.findOne.mockResolvedValue(null);
        await expect(auth_services_1.AuthService.login("wrong@test.com", "password")).rejects.toThrow();
    });
    it("throws 401 for wrong password", async () => {
        User_1.User.findOne.mockResolvedValue({
            comparePassword: jest.fn().mockResolvedValue(false)
        });
        await expect(auth_services_1.AuthService.login("test@test.com", "wrongpass")).rejects.toThrow();
    });
    it("signup returns access token", async () => {
        User_1.User.create.mockResolvedValue({
            id: "123"
        });
        jwtUtils.generateAccessToken
            .mockReturnValue("token123");
        const result = await auth_services_1.AuthService.signup({
            name: "Test",
            email: "test@test.com",
            password: "123456"
        });
        expect(result.accessToken).toBeDefined();
    });
    it("refresh generates new access token", async () => {
        jwtUtils.verifyRefreshToken
            .mockReturnValue({ userId: "123" });
        jwtUtils.generateAccessToken
            .mockReturnValue("newToken");
        const result = await auth_services_1.AuthService.refresh("refreshToken");
        expect(result.accessToken).toBe("newToken");
    });
    it("forgotPassword throws error if user not found", async () => {
        User_1.User.findOne.mockResolvedValue(null);
        await expect(auth_services_1.AuthService.forgotPassword("no@test.com")).rejects.toThrow();
    });
    it("resetPassword throws error for invalid token", async () => {
        User_1.User.findOne.mockResolvedValue(null);
        await expect(auth_services_1.AuthService.resetPassword("badtoken", "123456")).rejects.toThrow();
    });
});
