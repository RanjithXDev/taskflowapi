import { TaskService } from "../../src/services/task.services";
import { Task } from "../../src/models/Task";

jest.mock("../../src/models/Task");

describe("Offset Pagination", () => {

  it("calculates totalPages correctly", async () => {

    (Task.find as any).mockReturnValue({
      populate: () => ({
        populate: () => ({
          sort: () => ({
            skip: () => ({
              limit: () => Promise.resolve([])
            })
          })
        })
      })
    });

    (Task.countDocuments as any).mockResolvedValue(25);

    const result = await TaskService.findAll({
      page: 1,
      limit: 10
    });

    expect(result.totalPages).toBe(3);

  });

});