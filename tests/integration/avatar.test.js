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
describe("User Avatar Integration", () => {
    let token;
    beforeAll(async () => {
        const signup = await (0, supertest_1.default)(app_1.default)
            .post("/api/auth/signup")
            .send({
            name: "Avatar User",
            email: "avatar@test.com",
            password: "password123"
        });
        token = signup.body.accessToken;
    });
    it("should upload avatar and return URL", async () => {
        // create fake image buffer
        const avatarBuffer = Buffer.from("fake image data");
        const uploadRes = await (0, supertest_1.default)(app_1.default)
            .put("/api/auth/me/avatar")
            .set("Authorization", `Bearer ${token}`)
            .attach("avatar", avatarBuffer, "avatar.png");
        expect(uploadRes.status).toBe(200);
        const meRes = await (0, supertest_1.default)(app_1.default)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);
        expect(meRes.status).toBe(200);
        expect(meRes.body.avatar).toBeDefined();
    });
});
