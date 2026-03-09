import nodemailer from "nodemailer";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-id" })
  })
}));

describe("Email Transport Mock", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call createTransport when creating a transporter", () => {
    process.env.NODE_ENV = "test";
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user: "a", pass: "b" } });
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(transport.sendMail).toBeDefined();
  });

  it("should call sendMail with correct params", async () => {
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user: "a", pass: "b" } });
    await transport.sendMail({ from: "a@a.com", to: "b@b.com", subject: "test", html: "<p>hi</p>" });
    expect(transport.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "b@b.com", subject: "test" })
    );
  });

});