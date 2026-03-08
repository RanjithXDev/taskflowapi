"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_services_1 = require("../../src/services/task.services");
const Task_1 = require("../../src/models/Task");
jest.mock("../../src/models/Task");
describe("Offset Pagination", () => {
    it("calculates totalPages correctly", async () => {
        Task_1.Task.find.mockReturnValue({
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
        Task_1.Task.countDocuments.mockResolvedValue(25);
        const result = await task_services_1.TaskService.findAll({
            page: 1,
            limit: 10
        });
        expect(result.totalPages).toBe(3);
    });
});
