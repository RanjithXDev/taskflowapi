"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_validator_1 = require("../../src/validators/custom.validator");
describe("Custom Validators", () => {
    test("should reject past date", () => {
        const pastDate = new Date("2020-01-01").toISOString();
        expect(() => (0, custom_validator_1.isFutureDate)(pastDate)).toThrow();
    });
    test("should accept future date", () => {
        const futureDate = new Date(Date.now() + 86400000).toISOString();
        expect((0, custom_validator_1.isFutureDate)(futureDate)).toBe(true);
    });
    test("should reject more than 10 tags", () => {
        const tags = new Array(11).fill("tag");
        expect(() => (0, custom_validator_1.validateTags)(tags)).toThrow();
    });
    test("should accept valid tags", () => {
        const tags = ["node", "express", "api"];
        expect((0, custom_validator_1.validateTags)(tags)).toBe(true);
    });
});
