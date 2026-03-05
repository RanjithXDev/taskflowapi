import { sanitizeInput } from "../../src/utils/sanitize";

describe("sanitizeInput", () => {

  test("should remove script tags", () => {

    const input = "<script>alert('x')</script>Hello";

    const result = sanitizeInput(input);

    expect(result).toBe("Hello");

  });

});