"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
describe("Sorting + Filtering", () => {
    it("returns tasks sorted by priority", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks?priority=high&sortBy=createdAt&order=desc");
        expect(res.status).toBe(200);
        const tasks = res.body.data;
        for (let i = 1; i < tasks.length; i++) {
            expect(new Date(tasks[i - 1].createdAt).getTime()).toBeGreaterThanOrEqual(new Date(tasks[i].createdAt).getTime());
        }
    });
});
