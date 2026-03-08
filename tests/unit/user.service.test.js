"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_services_1 = require("../../src/services/user.services");
const User_1 = require("../../src/models/User");
jest.mock("../../src/models/User");
describe("UserService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("create user", async () => {
        const mockUser = { name: "Test User" };
        const expectedPayload = { name: "Test User", verified: false };
        User_1.User.create.mockResolvedValue(mockUser);
        const result = await user_services_1.UserService.create(mockUser);
        expect(User_1.User.create).toHaveBeenCalledWith(expectedPayload);
        expect(result).toEqual(mockUser);
    });
    it("findAll returns users", async () => {
        const mockUsers = [{ name: "User1" }];
        const selectMock = jest.fn().mockResolvedValue(mockUsers);
        User_1.User.find.mockReturnValue({
            select: selectMock
        });
        const result = await user_services_1.UserService.findAll();
        expect(result).toEqual(mockUsers);
    });
});
