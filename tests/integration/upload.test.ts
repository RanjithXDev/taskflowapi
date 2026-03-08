jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678'
}));

import request from "supertest";
import app from "../../src/app";
import fs from "fs";
import path from "path";

describe("Upload Limit Integration", () => {

  let token: string;
  let taskId: string;

  beforeAll(async () => {

   
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Upload User",
        email: "upload@test.com",
        password: "password123"
      });

    token = signup.body.accessToken;

    // create task
    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Upload Test Task",
        description: "Testing upload",
        status: "todo",
        priority: "low"
      });

    taskId = taskRes.body._id;
  });

  it("should reject oversized file", async () => {

    
    const largeFile = Buffer.alloc(6 * 1024 * 1024);

    const res = await request(app)
      .post(`/api/tasks/${taskId}/attachments`)
      .set("Authorization", `Bearer ${token}`)
      .attach("attachment", largeFile, "large.pdf");

    expect(res.status).toBe(400);

  });

});