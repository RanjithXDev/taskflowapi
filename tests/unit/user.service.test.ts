/**
 * Comprehensive unit tests for UserService
 */
import { UserService } from "../../src/services/user.services";
import { User } from "../../src/models/User";

jest.mock("../../src/models/User");

describe("UserService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("creates user with verified: false by default", async () => {
      const mockUser = { name: "Test", verified: false };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.create({ name: "Test" });

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({ verified: false })
      );
      expect(result).toEqual(mockUser);
    });

    it("spreads provided data into create call", async () => {
      const input = { name: "John", email: "john@example.com" };
      const mockUser = { ...input, verified: false };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.create(input);

      expect(User.create).toHaveBeenCalledWith({ ...input, verified: false });
    });
  });

  describe("findAll", () => {
    it("returns all users without passwords", async () => {
      const mockUsers = [{ name: "User1" }, { name: "User2" }];
      const selectMock = jest.fn().mockResolvedValue(mockUsers);
      (User.find as jest.Mock).mockReturnValue({ select: selectMock });

      const result = await UserService.findAll();

      expect(User.find).toHaveBeenCalled();
      expect(selectMock).toHaveBeenCalledWith("-password");
      expect(result).toEqual(mockUsers);
    });
  });

  describe("update", () => {
    it("throws error if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(UserService.update("bad-id", { name: "new" })).rejects.toThrow("User not found");
    });

    it("updates name field", async () => {
      const fakeUser: any = { name: "Old", save: jest.fn() };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      await UserService.update("user-id", { name: "New Name" });

      expect(fakeUser.name).toBe("New Name");
      expect(fakeUser.save).toHaveBeenCalled();
    });

    it("updates email field", async () => {
      const fakeUser: any = { email: "old@test.com", save: jest.fn() };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      await UserService.update("user-id", { email: "new@test.com" });

      expect(fakeUser.email).toBe("new@test.com");
    });

    it("updates role field", async () => {
      const fakeUser: any = { role: "user", save: jest.fn() };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      await UserService.update("user-id", { role: "admin" });

      expect(fakeUser.role).toBe("admin");
    });

    it("updates avatar if provided", async () => {
      const fakeUser: any = { avatar: undefined, save: jest.fn() };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      await UserService.update("user-id", { avatar: "avatar.png" });

      expect(fakeUser.avatar).toBe("avatar.png");
    });

    it("does not modify fields not provided", async () => {
      const fakeUser: any = { name: "Original", email: "orig@test.com", save: jest.fn() };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      await UserService.update("user-id", {});

      expect(fakeUser.name).toBe("Original");
      expect(fakeUser.email).toBe("orig@test.com");
    });
  });

  describe("delete", () => {
    it("throws error if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(UserService.delete("bad-id")).rejects.toThrow("User not found");
    });

    it("calls deleteOne on user", async () => {
      const fakeUser: any = { deleteOne: jest.fn().mockResolvedValue({}) };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      const result = await UserService.delete("user-id");

      expect(fakeUser.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(fakeUser);
    });
  });
});