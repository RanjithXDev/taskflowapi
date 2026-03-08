"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_controllers_1 = require("../../src/controllers/task.controllers");
const task_services_1 = require("../../src/services/task.services");
const socket_1 = require("../../src/socket/socket");
jest.mock("../../src/socket/socket");
describe("Socket Event Emission", () => {
    it("emits task:created event", async () => {
        const mockEmit = jest.fn();
        socket_1.getIO.mockReturnValue({
            to: () => ({
                emit: mockEmit
            })
        });
        task_services_1.TaskService.create = jest.fn().mockResolvedValue({
            project: "123",
            title: "Test"
        });
        const req = { body: {} };
        const res = { status: () => ({ json: jest.fn() }) };
        await (0, task_controllers_1.createTask)(req, res, jest.fn());
        expect(mockEmit).toHaveBeenCalledWith("task:created", expect.any(Object));
    });
});
