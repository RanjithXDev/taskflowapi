/**
 * Comprehensive unit tests for CommentService
 */
import { CommentService } from "../../src/services/comment.services";
import { Comment } from "../../src/models/Comment";
import { Task } from "../../src/models/Task";

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

  describe("create", () => {
    it("creates a comment for a valid task", async () => {
      const mockTask = { _id: "task-id", title: "Task" };
      const mockComment = { _id: "comment-id", content: "Hello", task: "task-id", author: "user-id" };

      (Task.findById as jest.Mock).mockResolvedValue(mockTask);
      (Comment.create as jest.Mock).mockResolvedValue(mockComment);

      const result = await CommentService.create({
        content: "Hello",
        task: "task-id",
        author: "user-id"
      });

      expect(Task.findById).toHaveBeenCalledWith("task-id");
      expect(Comment.create).toHaveBeenCalled();
      expect(result).toEqual(mockComment);
    });

    it("throws error when task not found", async () => {
      (Task.findById as jest.Mock).mockResolvedValue(null);

      await expect(CommentService.create({
        content: "Hello",
        task: "invalid-task",
        author: "user-id"
      })).rejects.toThrow("Task not found");
    });

    it("validates parent comment belongs to same task", async () => {
      const mockTask = { _id: "task-id" };
      const parentComment = { _id: "parent-id", task: { toString: () => "different-task-id" } };

      (Task.findById as jest.Mock).mockResolvedValue(mockTask);
      (Comment.findById as jest.Mock).mockResolvedValue(parentComment);

      await expect(CommentService.create({
        content: "Reply",
        task: "task-id",
        parent: "parent-id",
        author: "user-id"
      })).rejects.toThrow("Parent comment does not belong to this task");
    });

    it("throws error when parent comment not found", async () => {
      const mockTask = { _id: "task-id" };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);
      (Comment.findById as jest.Mock).mockResolvedValue(null);

      await expect(CommentService.create({
        content: "Reply",
        task: "task-id",
        parent: "nonexistent-parent",
        author: "user-id"
      })).rejects.toThrow("Parent comment not found");
    });

    it("creates a reply comment when parent belongs to same task", async () => {
      const mockTask = { _id: "task-id" };
      const parentComment = { _id: "parent-id", task: { toString: () => "task-id" } };
      const mockComment = { _id: "reply-id", content: "Reply" };

      (Task.findById as jest.Mock).mockResolvedValue(mockTask);
      (Comment.findById as jest.Mock).mockResolvedValue(parentComment);
      (Comment.create as jest.Mock).mockResolvedValue(mockComment);

      const result = await CommentService.create({
        content: "Reply",
        task: "task-id",
        parent: "parent-id",
        author: "user-id"
      });

      expect(result).toEqual(mockComment);
    });
  });

  describe("findByTask", () => {
    it("returns comments for a task", async () => {
      const mockComments = [
        { _id: "1", content: "Comment 1", task: "task-id" },
        { _id: "2", content: "Comment 2", task: "task-id" }
      ];

      (Comment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockComments)
        })
      });

      const result = await CommentService.findByTask("task-id");

      expect(Comment.find).toHaveBeenCalledWith({ task: "task-id" });
      expect(result).toEqual(mockComments);
    });

    it("returns empty array when no comments exist", async () => {
      (Comment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue([])
        })
      });

      const result = await CommentService.findByTask("task-id");

      expect(result).toEqual([]);
    });
  });

  describe("delete", () => {
    it("deletes a comment successfully", async () => {
      const mockComment = { _id: "comment-id", deleteOne: jest.fn().mockResolvedValue({}) };
      (Comment.findById as jest.Mock).mockResolvedValue(mockComment);

      const result = await CommentService.delete("comment-id");

      expect(mockComment.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(mockComment);
    });

    it("throws error when comment not found", async () => {
      (Comment.findById as jest.Mock).mockResolvedValue(null);

      await expect(CommentService.delete("bad-id")).rejects.toThrow("Comment not found");
    });
  });
});