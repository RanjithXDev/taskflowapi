import request from "supertest";
import app from "../../src/app";

describe("Validation Integration", () => {

  test("POST /api/tasks invalid priority", async () => {

    const res = await request(app)
      .post("/api/tasks")
      .send({
        title: "Task test",
        priority: "INVALID"
      });

    expect(res.status).toBe(400);
  });

  test("invalid email should return validation error", async () => {

    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "invalidemail",
        password: "password123",
        name: "Test"
      });

    expect(res.status).toBe(400);
  });

});