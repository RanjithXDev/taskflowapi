/**
 * Unit tests for socket event emission in task controller
 */

jest.mock("../../src/socket/socket");
jest.mock("../../src/services/task.services");
jest.mock("../../src/models/Task");
jest.mock("../../src/models/User");
jest.mock("../../src/services/email.services", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined)
}));

import { createTask, updateTask, deleteTask } from "../../src/controllers/task.controllers";
import { TaskService } from "../../src/services/task.services";
import { getIO } from "../../src/socket/socket";

describe("Socket Event Emission", () => {

  let mockEmit: jest.Mock;
  let mockTo: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit = jest.fn();
    mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
    (getIO as jest.Mock).mockReturnValue({ to: mockTo });
  });

  it("emits task:created event when task is created", async () => {
    const mockTask = { _id: "task-1", project: "proj-1", title: "Test" };
    (TaskService.create as jest.Mock).mockResolvedValue(mockTask);

    const req: any = { body: { title: "Test", project: "proj-1" } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createTask(req, res, jest.fn());

    expect(mockTo).toHaveBeenCalledWith("proj-1");
    expect(mockEmit).toHaveBeenCalledWith("task:created", mockTask);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("emits task:updated event on update", async () => {
    const mockTask = { _id: "task-1", project: "proj-1", title: "Updated" };
    (TaskService.update as jest.Mock).mockResolvedValue(mockTask);

    const req: any = { params: { id: "task-1" }, body: { title: "Updated" } };
    const res: any = { json: jest.fn() };

    await updateTask(req, res, jest.fn());

    expect(mockTo).toHaveBeenCalledWith("proj-1");
    expect(mockEmit).toHaveBeenCalledWith("task:updated", mockTask);
  });

  it("emits task:status-changed when status is updated", async () => {
    const mockTask = { _id: "task-1", project: "proj-1", status: "done" };
    (TaskService.update as jest.Mock).mockResolvedValue(mockTask);

    const req: any = { params: { id: "task-1" }, body: { status: "done" } };
    const res: any = { json: jest.fn() };

    await updateTask(req, res, jest.fn());

    expect(mockEmit).toHaveBeenCalledWith("task:status-changed", mockTask);
  });

  it("emits task:assigned when assignee is updated", async () => {
    const mockTask = { _id: "task-1", project: "proj-1", assignee: "user-2" };
    (TaskService.update as jest.Mock).mockResolvedValue(mockTask);

    const req: any = { params: { id: "task-1" }, body: { assignee: "user-2" } };
    const res: any = { json: jest.fn() };

    await updateTask(req, res, jest.fn());

    expect(mockEmit).toHaveBeenCalledWith("task:assigned", mockTask);
  });

  it("calls next on createTask error", async () => {
    const error = new Error("Create failed");
    (TaskService.create as jest.Mock).mockRejectedValue(error);

    const req: any = { body: {} };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createTask(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("emits task:updated on soft delete", async () => {
    const mockTask = { _id: "task-1", project: "proj-1", deletedAt: new Date() };
    (TaskService.delete as jest.Mock).mockResolvedValue(mockTask);

    const req: any = { params: { id: "task-1" } };
    const res: any = { json: jest.fn() };

    await deleteTask(req, res, jest.fn());

    expect(mockEmit).toHaveBeenCalledWith("task:updated", mockTask);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Task soft deleted" })
    );
  });
});