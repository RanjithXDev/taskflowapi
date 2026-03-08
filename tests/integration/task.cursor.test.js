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
describe("Cursor Pagination Traversal", () => {
    it("traverses dataset without duplicates", async () => {
        let cursor = null;
        let results = [];
        for (let i = 0; i < 5; i++) {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/tasks?cursor=${cursor}&limit=5`);
            const tasks = res.body.data || [];
            results.push(...tasks);
            cursor = res.body.nextCursor;
            if (!res.body.hasMore)
                break;
        }
        const ids = results.map(r => r._id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});
