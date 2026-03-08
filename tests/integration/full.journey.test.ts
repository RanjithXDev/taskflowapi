import request from "supertest";
import app from "../../src/app";

describe("Full User Journey", () => {

  
  let projectId: string;
  let taskId: string;
const assigneeId = "507f1f77bcf86cd799439011";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE4ZmU4MTM4YWM0ZTUxNmJiMTBiY2IiLCJpYXQiOjE3NzI2ODMwMzIsImV4cCI6MTc3MjY4MzkzMn0.ya4U_fSSZzk27xNRQZPzs74sfAgJaijVpwQHnchO-30";
  const user = {
    name: "Test User",
    email: "journey@test.com",
    password: "password123"
  };

  it("should signup user", async () => {

    const res = await request(app)
      .post("/api/auth/signup")
      .send(user);

    expect([200, 201]).toContain(res.status);

  });

  it("should  not login user without valid crenditials", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.name,
        password: user.password
      });

    expect(res.status).toBe(400);

   
    

  });

  


  it("should get project list", async () => {

    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

  });


  it("should handle invalid project ID", async () => {

    const res = await request(app)
      .get("/api/projects/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect([400, 404]).toContain(res.status);

  });

});