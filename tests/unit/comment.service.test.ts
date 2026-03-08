import { CommentService } from "../../src/services/comment.services";
import { Comment } from "../../src/models/Comment";

jest.mock("../../src/models/Comment");
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678'
}));

describe("CommentService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a comment", async () => {

    const mockComment = { _id: "123", content: "Test comment", task: "456", author: "789" };
    (Comment.create as jest.Mock).mockResolvedValue(mockComment);

    const result = await CommentService.create({
      content: "Test comment",
      task: "456",
      author: "789"
    });

    expect(result).toEqual(mockComment);
    expect(Comment.create).toHaveBeenCalled();

  });

  it("should find comments for a task", async () => {

    const mockComments = [
      { _id: "1", content: "Comment 1", task: "456" },
      { _id: "2", content: "Comment 2", task: "456" }
    ];

    (Comment.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockComments)
      })
    });

    const result = await CommentService.findByTask("456");

    expect(result).toEqual(mockComments);

  });

  it("should delete a comment", async () => {

    const mockComment = { _id: "123", deleteOne: jest.fn() };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);

    const result = await CommentService.delete("123");

    expect(result).toEqual(mockComment);

  });

});
