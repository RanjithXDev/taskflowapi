"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('uuid', () => ({
    v4: () => 'test-uuid-1234-5678'
}));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
describe("Validation Integration", () => {
    test("POST /api/tasks invalid priority", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/tasks")
            .send({
            title: "Task test",
            priority: "INVALID"
        });
        expect(res.status).toBe(400);
    });
    test("invalid email should return validation error", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/signup")
            .send({
            email: "invalidemail",
            password: "password123",
            name: "Test"
        });
        expect(res.status).toBe(400);
    });
});
