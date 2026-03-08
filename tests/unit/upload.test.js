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
describe("File Upload Validation", () => {
    it("should reject files larger than 5MB", async () => {
        // create 6MB buffer
        const bigFileBuffer = Buffer.alloc(6 * 1024 * 1024);
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/tasks/123/attachments")
            .attach("attachment", bigFileBuffer, "bigfile.pdf");
        expect(res.status).toBeGreaterThanOrEqual(400);
    });
    it("should reject .exe files", async () => {
        // small buffer but with .exe filename
        const exeBuffer = Buffer.from("fake executable content");
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/tasks/123/attachments")
            .attach("attachment", exeBuffer, "malware.exe");
        expect(res.status).toBeGreaterThanOrEqual(400);
    });
});
