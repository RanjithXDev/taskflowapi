import request from "supertest";
import app from "../../src/app";

describe("Pagination API", () => {

  it("returns correct page slice", async () => {

    const res = await request(app)
      .get("/api/tasks?page=1&limit=5");

    expect(res.status).toBe(200);

    expect(res.body.data.length).toBeLessThanOrEqual(5);

  });

});