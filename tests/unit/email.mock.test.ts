import nodemailer from "nodemailer";

jest.mock("nodemailer");

describe("Email Transport Mock", () => {

  it("should use mock transport in test environment", () => {

    process.env.NODE_ENV = "test";

    const transport = nodemailer.createTransport();

    expect(nodemailer.createTransport).toHaveBeenCalled();

  });

});