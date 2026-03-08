"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_1 = require("../../src/utils/sanitize");
describe("sanitizeInput", () => {
    test("should remove script tags", () => {
        const input = "<script>alert('x')</script>Hello";
        const result = (0, sanitize_1.sanitizeInput)(input);
        expect(result).toBe("Hello");
    });
});
