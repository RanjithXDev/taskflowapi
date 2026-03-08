"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_services_1 = require("../../src/services/task.services");
const Task_1 = require("../../src/models/Task");
jest.mock("../../src/models/Task");
const mockedTask = Task_1.Task;
describe("TaskService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("create passes correct data to database", async () => {
        const mockTask = { title: "Test Task" };
        mockedTask.create.mockResolvedValue(mockTask);
        const result = await task_services_1.TaskService.create(mockTask);
        expect(mockedTask.create).toHaveBeenCalledWith(mockTask);
        expect(result).toEqual(mockTask);
    });
    it("create throws error if dueDate is in past", async () => {
        const pastDate = new Date(Date.now() - 10000);
        await expect(task_services_1.TaskService.create({
            title: "Past Task",
            dueDate: pastDate
        })).rejects.toThrow("Due date must be in the future");
    });
    it("findAll passes pagination parameters", async () => {
        const mockTasks = [];
        const limitMock = jest.fn().mockResolvedValue(mockTasks);
        const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
        const sortMock = jest.fn().mockReturnValue({ skip: skipMock });
        const populateMock2 = jest.fn().mockReturnValue({ sort: sortMock });
        const populateMock1 = jest.fn().mockReturnValue({ populate: populateMock2 });
        mockedTask.find.mockReturnValue({
            populate: populateMock1
        });
        mockedTask.countDocuments = jest.fn().mockResolvedValue(5);
        await task_services_1.TaskService.findAll({ page: 2, limit: 10 });
        expect(skipMock).toHaveBeenCalledWith(10);
        expect(limitMock).toHaveBeenCalledWith(10);
    });
    it("findById returns task", async () => {
        const mockTask = { title: "Task" };
        const populateMock = jest.fn().mockResolvedValue(mockTask);
        mockedTask.findOne.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: populateMock
            })
        });
        const result = await task_services_1.TaskService.findById("123");
        expect(mockedTask.findOne).toHaveBeenCalled();
        expect(result).toEqual(mockTask);
    });
    it("update merges partial data correctly", async () => {
        const task = {
            title: "Old Title",
            save: jest.fn()
        };
        mockedTask.findOne.mockResolvedValue(task);
        await task_services_1.TaskService.update("123", { title: "New Title" });
        expect(task.title).toBe("New Title");
        expect(task.save).toHaveBeenCalled();
    });
    it("delete sets deletedAt instead of removing document", async () => {
        const task = {
            deletedAt: null,
            save: jest.fn()
        };
        mockedTask.findById.mockResolvedValue(task);
        await task_services_1.TaskService.delete("123");
        expect(mockedTask.findById).toHaveBeenCalledWith("123");
        expect(task.deletedAt).not.toBeNull();
        expect(task.save).toHaveBeenCalled();
    });
});
