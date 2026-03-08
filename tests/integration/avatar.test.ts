jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678'
}));

import request from "supertest";
import app from "../../src/app";

describe("User Avatar Integration", () => {

  let token: string;

  beforeAll(async () => {

    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Avatar User",
        email: "avatar@test.com",
        password: "password123"
      });

    token = signup.body.accessToken;

  });

  it("should upload avatar and return URL", async () => {

    // create fake image buffer
    const avatarBuffer = Buffer.from("fake image data");

    const uploadRes = await request(app)
      .put("/api/auth/me/avatar")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", avatarBuffer, "avatar.png");

    expect(uploadRes.status).toBe(200);

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);

    expect(meRes.body.avatar).toBeDefined();

  });

});