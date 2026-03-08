"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAdmin_1 = require("../../src/middleware/isAdmin");
const User_1 = require("../../src/models/User");
jest.mock("../../src/models/User");
describe("isAdmin middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { userId: "1" };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });
    it("passes for admin role", async () => {
        User_1.User.findById
            .mockResolvedValue({ role: "admin" });
        await (0, isAdmin_1.isAdmin)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it("returns 403 for regular user role", async () => {
        User_1.User.findById
            .mockResolvedValue({ role: "user" });
        await (0, isAdmin_1.isAdmin)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });
});
