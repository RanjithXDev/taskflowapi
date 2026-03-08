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
describe("Upload Limit Integration", () => {
    let token;
    let taskId;
    beforeAll(async () => {
        const signup = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/signup")
            .send({
            name: "Upload User",
            email: "upload@test.com",
            password: "password123"
        });
        token = signup.body.accessToken;
        // create task
        const taskRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
            title: "Upload Test Task",
            description: "Testing upload",
            status: "todo",
            priority: "low"
        });
        taskId = taskRes.body._id;
    });
    it("should reject oversized file", async () => {
        const largeFile = Buffer.alloc(6 * 1024 * 1024);
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/tasks/${taskId}/attachments`)
            .set("Authorization", `Bearer ${token}`)
            .attach("attachment", largeFile, "large.pdf");
        expect(res.status).toBe(400);
    });
});
