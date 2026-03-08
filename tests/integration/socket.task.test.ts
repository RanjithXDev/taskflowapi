jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678'
}));

import jwt from "jsonwebtoken";
import { io } from "socket.io-client";
import request from "supertest";
import http from "http";
import app from "../../src/app";
import { initSocket } from "../../src/socket/socket";

let server: any;
let clientSocket: any;

beforeAll((done) => {
  server = http.createServer(app);
  initSocket(server);
  const token = jwt.sign(
    {userId: "testUser"},
    process.env.JWT_SECRET || "secret"
  )

  server.listen(0, () => {
    const port = server.address().port;

    clientSocket = io(`http://localhost:${port}`, {
      transports: ["websocket"]
    });

    clientSocket.on("connect", done);
  });
});

afterAll(() => {
  clientSocket.close();
  server.close();
});

describe("Socket task:created event", () => {

  xit("client receives event after task creation", (done) => {

    clientSocket.on("task:created", (data: any) => {
      expect(data).toHaveProperty("title");
      done();
    });

    request(server)
      .post("/api/tasks")
      .send({
        title: "Socket Test",
        description: "desc",
        priority: "high"
      });

  });

  xit("rejects unauthenticated connection", (done) => {

    const socket = io(`http://localhost:${server.address().port}`, {
      transports: ["websocket"]
    });

    socket.on("connect_error", (err: any) => {
      expect(err.message).toBeDefined();
      done();
    });

  });

});