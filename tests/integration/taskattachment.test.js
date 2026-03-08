"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('uuid', () => ({
    v4: () => 'test-uuid-1234-5678'
}));
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app_1 = __importDefault(require("../../src/app"));
describe("Task Attachment Integration", () => {
    let token;
    let taskId;
    let attachmentId;
    const filePath = path_1.default.resolve(__dirname, "../fixtures/sample.pdf");
    beforeAll(async () => {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error("Fixture file missing: " + filePath);
        }
        // create user
        const signup = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/signup")
            .send({
            name: "Attach User",
            email: "attach@test.com",
            password: "password123"
        });
        token = signup.body.accessToken;
        // create task
        const taskRes = await (0, supertest_1.default)(app_1.default)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
            title: "Attachment Task",
            description: "Testing attachments",
            status: "todo",
            priority: "low"
        });
        expect(taskRes.status).toBe(201);
        taskId = taskRes.body._id;
    });
    xit("should upload a file", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/tasks/${taskId}/attachments`)
            .set("Authorization", `Bearer ${token}`)
            .attach("attachment", filePath);
        expect(res.status).toBe(201);
        attachmentId = res.body.attachment?.id || 0;
    });
    xit("should download the uploaded file", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get(`/api/tasks/${taskId}/attachments/${attachmentId}`)
            .set("Authorization", `Bearer ${token}`);
        console.log("DOWNLOAD RESPONSE:", res.status);
        expect(res.status).toBe(200);
        expect(res.headers["content-type"])
            .toContain("application");
    });
});
