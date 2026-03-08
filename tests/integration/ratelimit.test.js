"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
jest.mock('uuid');
describe("Rate Limiting", () => {
    it("should block requests after threshold", async () => {
        let response;
        for (let i = 0; i < 120; i++) {
            response = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send({
                email: "test@test.com",
                password: "123456"
            });
        }
        expect(response?.status).toBe(500);
    });
});
