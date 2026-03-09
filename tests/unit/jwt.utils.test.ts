/**
 * Unit tests for JWT utility functions
 */
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../src/utils/jwt";

describe("JWT Utilities", () => {

  const userId = "test-user-id-123";

  describe("generateAccessToken", () => {
    it("generates a non-empty string token", () => {
      const token = generateAccessToken(userId);

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("generates tokens with three parts (JWT structure)", () => {
      const token = generateAccessToken(userId);
      const parts = token.split(".");

      expect(parts).toHaveLength(3);
    });
  });

  describe("generateRefreshToken", () => {
    it("generates a non-empty string token", () => {
      const token = generateRefreshToken(userId);

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("generates different token from access token", () => {
      const access = generateAccessToken(userId);
      const refresh = generateRefreshToken(userId);

      expect(access).not.toBe(refresh);
    });
  });

  describe("verifyAccessToken", () => {
    it("verifies a valid access token and returns payload", () => {
      const token = generateAccessToken(userId);
      const decoded: any = verifyAccessToken(token);

      expect(decoded.userId).toBe(userId);
    });

    it("throws for invalid access token", () => {
      expect(() => verifyAccessToken("invalid.token.here")).toThrow();
    });

    it("throws for a refresh token used as access token", () => {
      const refreshToken = generateRefreshToken(userId);

      expect(() => verifyAccessToken(refreshToken)).toThrow();
    });
  });

  describe("verifyRefreshToken", () => {
    it("verifies a valid refresh token and returns payload", () => {
      const token = generateRefreshToken(userId);
      const decoded: any = verifyRefreshToken(token);

      expect(decoded.userId).toBe(userId);
    });

    it("throws for invalid refresh token", () => {
      expect(() => verifyRefreshToken("bad-token")).toThrow();
    });

    it("throws for access token used as refresh token", () => {
      const accessToken = generateAccessToken(userId);

      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });
  });
});
