import request from "supertest";
import path from "path";
import fs from "fs";
import app from "../../src/app";

describe("Task Attachment Integration", () => {

  let token: string;
  let taskId: string;
  let attachmentId: string;

  const filePath = path.resolve(__dirname, "../fixtures/sample.pdf");

  beforeAll(async () => {

    if (!fs.existsSync(filePath)) {
      throw new Error("Fixture file missing: " + filePath);
    }

    // create user
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Attach User",
        email: "attach@test.com",
        password: "password123"
      });

    console.log("Signup:", signup.body);

    token = signup.body.accessToken;

    // create task
    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Attachment Task",
        description: "Testing attachments",
        status: "todo",
        priority: "low"
      });

    console.log("Task Create:", taskRes.body);

    expect(taskRes.status).toBe(201);

    taskId = taskRes.body._id;

  });


  xit("should upload a file", async () => {

    const res = await request(app)
      .post(`/api/tasks/${taskId}/attachments`)
      .set("Authorization", `Bearer ${token}`)
      .attach("attachment", filePath);

    console.log("UPLOAD RESPONSE:", res.body);
    

    expect(res.status).toBe(201);

    attachmentId = res.body.attachment?.id || 0;

  });


  xit("should download the uploaded file", async () => {

    const res = await request(app)
      .get(`/api/tasks/${taskId}/attachments/${attachmentId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("DOWNLOAD RESPONSE:", res.status);
    expect(res.status).toBe(200);

    expect(res.headers["content-type"])
      .toContain("application");

  });

});