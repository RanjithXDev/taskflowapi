"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('uuid', () => ({
    v4: () => 'test-uuid-1234-5678'
}));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_io_client_1 = require("socket.io-client");
const supertest_1 = __importDefault(require("supertest"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("../../src/app"));
const socket_1 = require("../../src/socket/socket");
let server;
let clientSocket;
beforeAll((done) => {
    server = http_1.default.createServer(app_1.default);
    (0, socket_1.initSocket)(server);
    const token = jsonwebtoken_1.default.sign({ userId: "testUser" }, process.env.JWT_SECRET || "secret");
    server.listen(0, () => {
        const port = server.address().port;
        clientSocket = (0, socket_io_client_1.io)(`http://localhost:${port}`, {
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
        clientSocket.on("task:created", (data) => {
            expect(data).toHaveProperty("title");
            done();
        });
        (0, supertest_1.default)(server)
            .post("/api/tasks")
            .send({
            title: "Socket Test",
            description: "desc",
            priority: "high"
        });
    });
    xit("rejects unauthenticated connection", (done) => {
        const socket = (0, socket_io_client_1.io)(`http://localhost:${server.address().port}`, {
            transports: ["websocket"]
        });
        socket.on("connect_error", (err) => {
            expect(err.message).toBeDefined();
            done();
        });
    });
});
