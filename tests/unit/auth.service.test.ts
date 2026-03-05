import bcrypt from "bcryptjs";
import { AuthService } from "../../src/services/auth.services";
import { User } from "../../src/models/User";
import * as jwtUtils from "../../src/utils/jwt";
import * as emailService from "../../src/utils/email";


jest.mock("../../src/models/User");
jest.mock("../../src/utils/jwt");





describe("AuthService.login", () => {

  it("throws 401 for wrong email", async () => {

    (User.findOne as jest.Mock)
      .mockResolvedValue(null);

    await expect(
      AuthService.login("wrong@test.com", "password")
    ).rejects.toThrow();

  });
  

});