import request from "supertest";
import app from "../../src/app";

describe("Sorting + Filtering", () => {

  it("returns tasks sorted by priority", async () => {

    const res = await request(app)
      .get("/api/tasks?priority=high&sortBy=createdAt&order=desc");

    expect(res.status).toBe(200);

    const tasks = res.body.data;

    for (let i = 1; i < tasks.length; i++) {

      expect(
        new Date(tasks[i - 1].createdAt).getTime()
      ).toBeGreaterThanOrEqual(
        new Date(tasks[i].createdAt).getTime()
      );

    }

  });

});