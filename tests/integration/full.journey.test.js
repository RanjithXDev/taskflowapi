"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
describe("Full User Journey", () => {
    let projectId;
    let taskId;
    const assigneeId = "507f1f77bcf86cd799439011";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE4ZmU4MTM4YWM0ZTUxNmJiMTBiY2IiLCJpYXQiOjE3NzI2ODMwMzIsImV4cCI6MTc3MjY4MzkzMn0.ya4U_fSSZzk27xNRQZPzs74sfAgJaijVpwQHnchO-30";
    const user = {
        name: "Test User",
        email: "journey@test.com",
        password: "password123"
    };
    it("should signup user", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/signup")
            .send(user);
        expect([200, 201]).toContain(res.status);
    });
    it("should  not login user without valid crenditials", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/login")
            .send({
            email: user.name,
            password: user.password
        });
        expect(res.status).toBe(400);
    });
    it("should get project list", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/projects")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
    it("should handle invalid project ID", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/projects/invalid-id")
            .set("Authorization", `Bearer ${token}`);
        expect([400, 404]).toContain(res.status);
    });
});
