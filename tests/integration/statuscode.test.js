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
describe("Status Code Tests", () => {
    test("should return 404 for unknown route", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/unknown-route");
        expect(res.status).toBe(404);
    });
});
