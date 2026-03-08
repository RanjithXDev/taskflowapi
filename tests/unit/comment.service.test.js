"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_services_1 = require("../../src/services/comment.services");
const Comment_1 = require("../../src/models/Comment");
const Task_1 = require("../../src/models/Task");
jest.mock("../../src/models/Comment", () => ({
    Comment: {
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
    },
}));
jest.mock("../../src/models/Task");
describe("CommentService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should create a comment", async () => {
        const mockTask = { _id: "456", title: "Test Task" };
        const mockComment = {
            _id: "123",
            text: "Test comment",
            task: "456",
            author: "789"
        };
        Task_1.Task.findById.mockResolvedValue(mockTask);
        Comment_1.Comment.create.mockResolvedValue(mockComment);
        const result = await comment_services_1.CommentService.create({
            text: "Test comment",
            task: "456",
            author: "789"
        });
        expect(result).toEqual(mockComment);
        expect(Comment_1.Comment.create).toHaveBeenCalled();
        expect(Task_1.Task.findById).toHaveBeenCalledWith("456");
    });
    it("should find comments for a task", async () => {
        const mockComments = [
            { _id: "1", text: "Comment 1", task: "456" },
            { _id: "2", text: "Comment 2", task: "456" }
        ];
        Comment_1.Comment.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockComments)
            })
        });
        const result = await comment_services_1.CommentService.findByTask("456");
        expect(result).toEqual(mockComments);
        expect(Comment_1.Comment.find).toHaveBeenCalledWith({ task: "456" });
    });
    it("should throw error when creating comment for non-existent task", async () => {
        Task_1.Task.findById.mockResolvedValue(null);
        await expect(comment_services_1.CommentService.create({
            text: "Test comment",
            task: "invalid-task",
            author: "789"
        })).rejects.toThrow("Task not found");
    });
    it("should delete a comment", async () => {
        const mockComment = { _id: "123", deleteOne: jest.fn().mockResolvedValue({}) };
        Comment_1.Comment.findById.mockResolvedValue(mockComment);
        const result = await comment_services_1.CommentService.delete("123");
        expect(result).toEqual(mockComment);
        expect(mockComment.deleteOne).toHaveBeenCalled();
    });
    it("should throw error when deleting non-existent comment", async () => {
        Comment_1.Comment.findById.mockResolvedValue(null);
        await expect(comment_services_1.CommentService.delete("invalid-id")).rejects.toThrow("Comment not found");
    });
});
