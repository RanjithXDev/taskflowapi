import { isFutureDate, validateTags } from "../../src/validators/custom.validator";

describe("Custom Validators", () => {

  test("should reject past date", () => {
    const pastDate  = new Date("2020-01-01").toISOString();

    expect(() => isFutureDate(pastDate )).toThrow();
  });

  test("should accept future date", () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    expect(isFutureDate(futureDate)).toBe(true);
  });

  test("should reject more than 10 tags", () => {
    const tags = new Array(11).fill("tag");

    expect(() => validateTags(tags)).toThrow();
  });

  test("should accept valid tags", () => {
    const tags = ["node", "express", "api"];

    expect(validateTags(tags)).toBe(true);
  });

});