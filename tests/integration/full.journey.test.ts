import request from "supertest";
import app from "../../src/app";

jest.mock('uuid');

describe("Full User Journey", () => {

  let token: string;
  let projectId: string;
  let taskId: string;

  it("signup user", async () => {

    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "journey@test.com",
        password: "password123"
      });

    expect(res.status).toBe(201);

  });

  it("login user", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "journey@test.com",
        password: "password123"
      });

    token = res.body.accessToken;

    expect(res.status).toBe(200);

  });

  it("create project", async () => {

    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Project" });

    projectId = res.body._id;

    expect(res.status).toBe(201);

  });

  it("create task", async () => {

    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task",
        description: "Test",
        priority: "high",
        project: projectId
      });

    taskId = res.body._id;

    expect(res.status).toBe(201);

  });

  it("add comment", async () => {

    const res = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Nice task" });

    expect(res.status).toBe(201);

  });

});