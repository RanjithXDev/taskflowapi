import jwt from "jsonwebtoken";

describe("Socket Auth", () => {

  it("rejects invalid JWT", () => {

    const invalidToken = "fake.token.value";

    expect(() =>
      jwt.verify(invalidToken, "secret")
    ).toThrow();

  });

});
