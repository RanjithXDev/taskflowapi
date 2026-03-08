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
describe("Pagination API", () => {
    it("returns correct page slice", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks?page=1&limit=5");
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(5);
    });
});
