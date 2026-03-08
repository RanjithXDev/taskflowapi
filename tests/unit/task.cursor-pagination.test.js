"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_services_1 = require("../../src/services/task.services");
const Task_1 = require("../../src/models/Task");
jest.mock("../../src/models/Task");
describe("Cursor Pagination", () => {
    it("returns nextCursor and hasMore correctly", async () => {
        const mockTasks = [
            { _id: "1" },
            { _id: "2" },
            { _id: "3" }
        ];
        Task_1.Task.find.mockReturnValue({
            populate: () => ({
                populate: () => ({
                    sort: () => ({
                        limit: () => Promise.resolve(mockTasks)
                    })
                })
            })
        });
        const result = await task_services_1.TaskService.findAll({
            cursor: "0",
            limit: 2
        });
        expect(result.hasMore).toBe(true);
        expect(result.nextCursor).toBeDefined();
    });
});
