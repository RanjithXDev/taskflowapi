import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { User } from "../../src/models/User";
import dotenv from "dotenv";

dotenv.config();



afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

it("Full signup flow works", async () => {

  const signup = await request(app)
    .post("/api/auth/signup")
    .send({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });

  expect(signup.status).toBe(201);
  expect(signup.body.accessToken).toBeDefined();

  const token = signup.body.accessToken;

  const me = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${token}`);

  expect(me.status).toBe(200);
  expect(me.body.email).toBe("test@example.com");

});

it("Login with correct credentials returns JWT", async () => {

  await request(app)
    .post("/api/auth/signup")
    .send({
      name: "Login User",
      email: "login@test.com",
      password: "password123"
    });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "login@test.com",
      password: "password123"
    });

  expect(res.status).toBe(200);
  expect(res.body.accessToken).toBeDefined();

});
it("Login with wrong password returns 401", async () => {

  await request(app)
    .post("/api/auth/signup")
    .send({
      name: "User",
      email: "fail@test.com",
      password: "password123"
    });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "fail@test.com",
      password: "wrongpassword"
    });

  expect(res.status).toBe(401);

});

it("Accessing protected route without token returns 401", async () => {

  const res = await request(app)
    .get("/api/auth/me");

  expect(res.status).toBe(401);

});

it("Admin-only route returns 403 for regular user", async () => {

  const signup = await request(app)
    .post("/api/auth/signup")
    .send({
      name: "Normal User",
      email: "user@test.com",
      password: "password123"
    });

  const token = signup.body.accessToken;

  const res = await request(app)
    .post("/api/users")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Another User",
      email: "another@test.com",
      password: "password123"
    });

  expect(res.status).toBe(403);

});

it("Password reset flow works", async () => {

  await request(app)
    .post("/api/auth/signup")
    .send({
      name: "Reset User",
      email: "reset@test.com",
      password: "password123"
    });

  const forgot = await request(app)
    .post("/api/auth/forgot-password")
    .send({
      email: "reset@test.com"
    });

  expect(forgot.status).toBe(200);

  const token = forgot.body.resetLink.split("/").pop();

  await request(app)
    .post(`/api/auth/reset-password/${token}`)
    .send({
      password: "newpassword123"
    });

  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email: "reset@test.com",
      password: "newpassword123"
    });

  expect(login.status).toBe(200);

});

it("Refresh token generates new access token", async () => {

  const signup = await request(app)
    .post("/api/auth/signup")
    .send({
      name: "Refresh User",
      email: "refresh@test.com",
      password: "password123"
    });

  const refreshToken = signup.body.refreshToken;

  const res = await request(app)
    .post("/api/auth/refresh")
    .send({
      refreshToken
    });

  expect(res.status).toBe(200);
  expect(res.body.accessToken).toBeDefined();

});