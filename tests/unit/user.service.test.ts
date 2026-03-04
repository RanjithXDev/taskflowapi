import { UserService } from "../../src/services/user.services";
import { User } from "../../src/models/User";

jest.mock("../../src/models/User");

describe("UserService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("create user", async () => {

    const mockUser = { name: "Test User" };

    (User.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await UserService.create(mockUser);

    expect(User.create).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);

  });

  it("findAll returns users", async () => {

    const mockUsers = [{ name: "User1" }];

    const selectMock = jest.fn().mockResolvedValue(mockUsers);

    (User.find as jest.Mock).mockReturnValue({
      select: selectMock
    });

    const result = await UserService.findAll();

    expect(result).toEqual(mockUsers);

  });

});