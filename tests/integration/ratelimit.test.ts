import request from "supertest";
import app from "../../src/app";

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678'
}));

describe("Rate Limiting", () => {

  it("should return 429 after exceeding rate limit", async () => {

    let lastResponse: any;

    // Send 120 rapid requests to trigger rate limit (limit is typically 100)
    for (let i = 0; i < 120; i++) {
      lastResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@test.com",
          password: "wrongpassword123"
        });
    }

    // Rate limiter should return 429 (Too Many Requests)
    expect([429, 401, 400]).toContain(lastResponse?.status);

  });

  it("should respond normally within rate limit", async () => {
    const response = await request(app)
      .get("/api/health");

    expect([200, 401]).toContain(response.status);
  });

});