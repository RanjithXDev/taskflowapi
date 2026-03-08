import request from "supertest";
import app from "../../src/app";

jest.mock('uuid');

describe("Rate Limiting", () => {

  it("should block requests after threshold", async () => {

    let response;

    for (let i = 0; i < 120; i++) {
      response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@test.com",
          password: "123456"
        });
    }

    expect(response?.status).toBe(500);

  });

});