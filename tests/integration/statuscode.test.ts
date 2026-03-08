jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678'
}));

import request from "supertest";
import app from "../../src/app";

describe("Status Code Tests", () => {

  test("should return 404 for unknown route", async () => {

    const res = await request(app)
      .get("/unknown-route");

    expect(res.status).toBe(404);

  });



});