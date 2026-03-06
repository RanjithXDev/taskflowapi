import request from "supertest";
import app from "../../src/app";

describe("File Upload Validation", () => {

  it("should reject files larger than 5MB", async () => {

    // create 6MB buffer
    const bigFileBuffer = Buffer.alloc(6 * 1024 * 1024);

    const res = await request(app)
      .post("/api/tasks/123/attachments")
      .attach("attachment", bigFileBuffer, "bigfile.pdf");

    expect(res.status).toBeGreaterThanOrEqual(400);

  });


  it("should reject .exe files", async () => {

    // small buffer but with .exe filename
    const exeBuffer = Buffer.from("fake executable content");

    const res = await request(app)
      .post("/api/tasks/123/attachments")
      .attach("attachment", exeBuffer, "malware.exe");

    expect(res.status).toBeGreaterThanOrEqual(400);

  });

});