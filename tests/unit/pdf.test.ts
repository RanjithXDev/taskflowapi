import request from "supertest";
import app from "../../src/app";
import PDFDocument from "pdfkit";

describe("File Upload Validation", () => {

  it("should reject files larger than 5MB", async () => {

    // create a 6MB buffer
    const bigFileBuffer = Buffer.alloc(6 * 1024 * 1024);

    const res = await request(app)
      .post("/api/tasks/123/attachments")
      .attach("file", bigFileBuffer, "bigfile.pdf");

    expect(res.status).toBe(400);

  });


  it("should generate a valid PDF buffer", async () => {

    const doc = new PDFDocument();

    const buffers: Buffer[] = [];

    doc.on("data", (chunk) => buffers.push(chunk));

    doc.text("Project Report");
    doc.text("Test Content");

    doc.end();

    await new Promise((resolve) => doc.on("end", resolve));

    const pdfBuffer = Buffer.concat(buffers);

    expect(pdfBuffer.length).toBeGreaterThan(100);

    // verify PDF header
    expect(pdfBuffer.slice(0,4).toString()).toBe("%PDF");

  });

});