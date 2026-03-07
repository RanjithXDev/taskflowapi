import { createTask } from "../../src/controllers/task.controllers";
import { TaskService } from "../../src/services/task.services";
import { getIO } from "../../src/socket/socket";

jest.mock("../../src/socket/socket");

describe("Socket Event Emission", () => {

  it("emits task:created event", async () => {

    const mockEmit = jest.fn();

    (getIO as any).mockReturnValue({
      to: () => ({
        emit: mockEmit
      })
    });

    (TaskService.create as any) = jest.fn().mockResolvedValue({
      project: "123",
      title: "Test"
    });

    const req: any = { body: {} };
    const res: any = { status: () => ({ json: jest.fn() }) };

    await createTask(req, res, jest.fn());

    expect(mockEmit).toHaveBeenCalledWith(
      "task:created",
      expect.any(Object)
    );

  });

});