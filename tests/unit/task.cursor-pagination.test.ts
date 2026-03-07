import { TaskService } from "../../src/services/task.services";
import { Task } from "../../src/models/Task";

jest.mock("../../src/models/Task");

describe("Cursor Pagination", () => {

  it("returns nextCursor and hasMore correctly", async () => {

    const mockTasks = [
      { _id: "1" },
      { _id: "2" },
      { _id: "3" }
    ];

    (Task.find as any).mockReturnValue({
      populate: () => ({
        populate: () => ({
          sort: () => ({
            limit: () => Promise.resolve(mockTasks)
          })
        })
      })
    });

    const result = await TaskService.findAll({
      cursor: "0",
      limit: 2
    });

    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBeDefined();

  });

});