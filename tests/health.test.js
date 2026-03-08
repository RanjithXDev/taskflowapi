"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('uuid', () => ({
    v4: () => 'test-uuid-1234-5678'
}));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('Health API Integration Tests', () => {
    it('GET /api/health should return 200 and correct structure', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('uptime');
    });
    it('GET /nonexistent should return 404', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/random-route');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message');
    });
    it('Health endpoint should include security headers (helmet)', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/health');
        expect(res.headers).toHaveProperty('x-content-type-options');
    });
    it('should return proper 404 structure', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/unknown-route');
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('Fail');
    });
});
