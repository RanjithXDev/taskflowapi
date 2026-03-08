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
const pdfkit_1 = __importDefault(require("pdfkit"));
describe("File Upload Validation", () => {
    it("should reject files larger than 5MB", async () => {
        // create a 6MB buffer
        const bigFileBuffer = Buffer.alloc(6 * 1024 * 1024);
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/tasks/123/attachments")
            .attach("file", bigFileBuffer, "bigfile.pdf");
        expect(res.status).toBe(400);
    });
    it("should generate a valid PDF buffer", async () => {
        const doc = new pdfkit_1.default();
        const buffers = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.text("Project Report");
        doc.text("Test Content");
        doc.end();
        await new Promise((resolve) => doc.on("end", resolve));
        const pdfBuffer = Buffer.concat(buffers);
        expect(pdfBuffer.length).toBeGreaterThan(100);
        // verify PDF header
        expect(pdfBuffer.slice(0, 4).toString()).toBe("%PDF");
    });
});
