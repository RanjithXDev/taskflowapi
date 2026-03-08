import { sendEmail } from "../../src/services/email.services";
import nodemailer from "nodemailer";

jest.mock("nodemailer");

describe("Email Service", () => {

  it("should compose verification email correctly", async () => {

    const sendMailMock = jest.fn().mockResolvedValue({ messageId: "123" });

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock
    });

    const result = await sendEmail(
      "test@example.com",
      "Verify your account",
      "<h2>Email Verification</h2>"
    );

    expect(result).toBeDefined();

  });

});