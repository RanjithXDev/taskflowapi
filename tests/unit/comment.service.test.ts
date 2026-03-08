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

  it("should create a comment", async () => {
    const mockTask = { _id: "456", title: "Test Task" };
    const mockComment = {
      _id: "123",
      text: "Test comment",
      task: "456",
      author: "789"
    };

    (Task.findById as unknown as jest.Mock).mockResolvedValue(mockTask);
    (Comment.create as unknown as jest.Mock).mockResolvedValue(mockComment);

    const result = await CommentService.create({
      text: "Test comment",
      task: "456",
      author: "789"
    });

    expect(result).toEqual(mockComment);
    expect(Comment.create).toHaveBeenCalled();
    expect(Task.findById).toHaveBeenCalledWith("456");
  });

  it("should find comments for a task", async () => {
    const mockComments = [
      { _id: "1", text: "Comment 1", task: "456" },
      { _id: "2", text: "Comment 2", task: "456" }
    ];

    (Comment.find as unknown as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockComments)
      })
    });

    const result = await CommentService.findByTask("456");

    expect(result).toEqual(mockComments);
    expect(Comment.find).toHaveBeenCalledWith({ task: "456" });
  });

  it("should throw error when creating comment for non-existent task", async () => {
    (Task.findById as unknown as jest.Mock).mockResolvedValue(null);

    await expect(CommentService.create({
      text: "Test comment",
      task: "invalid-task",
      author: "789"
    })).rejects.toThrow("Task not found");
  });

  

  it("should delete a comment", async () => {
    const mockComment = { _id: "123", deleteOne: jest.fn().mockResolvedValue({}) };
    
    (Comment.findById as unknown as jest.Mock).mockResolvedValue(mockComment);

    const result = await CommentService.delete("123");

    expect(result).toEqual(mockComment);
    expect(mockComment.deleteOne).toHaveBeenCalled();
  });

  it("should throw error when deleting non-existent comment", async () => {
    (Comment.findById as unknown as jest.Mock).mockResolvedValue(null);

    await expect(CommentService.delete("invalid-id")).rejects.toThrow("Comment not found");
  });

});