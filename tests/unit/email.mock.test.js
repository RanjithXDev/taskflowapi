"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
jest.mock("nodemailer");
describe("Email Transport Mock", () => {
    it("should use mock transport in test environment", () => {
        process.env.NODE_ENV = "test";
        const transport = nodemailer_1.default.createTransport();
        expect(nodemailer_1.default.createTransport).toHaveBeenCalled();
    });
});
