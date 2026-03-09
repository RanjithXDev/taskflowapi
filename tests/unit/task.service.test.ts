/**
 * Comprehensive unit tests for TaskService
 */
import { TaskService } from "../../src/services/task.services";
import { Task } from "../../src/models/Task";
import { User } from "../../src/models/User";

jest.mock("../../src/models/Task");
jest.mock("../../src/models/User");
jest.mock("../../src/services/email.services", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined)
}));

const mockedTask = Task as jest.Mocked<typeof Task>;

describe("TaskService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- create ---
  describe("create", () => {
    it("throws error if dueDate is in the past", async () => {
      const pastDate = new Date(Date.now() - 10000);
      await expect(
        TaskService.create({ title: "Past Task", dueDate: pastDate } as any)
      ).rejects.toThrow("Due date must be in the future");
    });

    it("creates task with correct data", async () => {
      const mockTask: any = { title: "Test Task", project: "proj-id" };
      mockedTask.create.mockResolvedValue(mockTask);

      const result = await TaskService.create({ title: "Test Task" } as any);

      expect(mockedTask.create).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it("sends email to assignee if present", async () => {
      const mockTask: any = { title: "Assigned Task", project: "proj-id", assignee: "user-id" };
      mockedTask.create.mockResolvedValue(mockTask);

      const fakeUser = { email: "user@test.com", name: "Test User" };
      (User.findById as jest.Mock).mockResolvedValue(fakeUser);

      await TaskService.create({ title: "Assigned Task", assignee: "user-id" } as any);

      expect(User.findById).toHaveBeenCalledWith("user-id");
    });

    it("does not fail if assignee user not found", async () => {
      const mockTask: any = { title: "Task", project: "proj-id", assignee: "ghost-id" };
      mockedTask.create.mockResolvedValue(mockTask);
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        TaskService.create({ title: "Task", assignee: "ghost-id" } as any)
      ).resolves.toBeDefined();
    });
  });

  // --- findAll ---
  describe("findAll", () => {
    it("uses offset pagination by default", async () => {
      const limitMock = jest.fn().mockResolvedValue([]);
      const skipMock = jest.fn().mockReturnValue({ limit: limitMock });
      const sortMock = jest.fn().mockReturnValue({ skip: skipMock });
      const populateMock2 = jest.fn().mockReturnValue({ sort: sortMock });
      const populateMock1 = jest.fn().mockReturnValue({ populate: populateMock2 });
      mockedTask.find.mockReturnValue({ populate: populateMock1 } as any);
      mockedTask.countDocuments = jest.fn().mockResolvedValue(5) as any;

      const result = await TaskService.findAll({ page: 1, limit: 10 });

      expect(skipMock).toHaveBeenCalledWith(0);
      expect(result.totalPages).toBe(1);
    });

    it("calculates totalPages correctly", async () => {
      mockedTask.find.mockReturnValue({
        populate: () => ({ populate: () => ({ sort: () => ({ skip: () => ({ limit: () => Promise.resolve([]) }) }) }) })
      } as any);
      mockedTask.countDocuments = jest.fn().mockResolvedValue(25) as any;

      const result = await TaskService.findAll({ page: 1, limit: 10 });

      expect(result.totalPages).toBe(3);
      expect(result.total).toBe(25);
    });

    it("uses cursor pagination when cursor provided", async () => {
      const mockTasks = [{ _id: "1" }, { _id: "2" }, { _id: "3" }];
      mockedTask.find.mockReturnValue({
        populate: () => ({ populate: () => ({ sort: () => ({ limit: () => Promise.resolve(mockTasks) }) }) })
      } as any);

      const result = await TaskService.findAll({ cursor: "abc", limit: 2 });

      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBeDefined();
    });

    it("filters by status", async () => {
      mockedTask.find.mockReturnValue({
        populate: () => ({ populate: () => ({ sort: () => ({ skip: () => ({ limit: () => Promise.resolve([]) }) }) }) })
      } as any);
      mockedTask.countDocuments = jest.fn().mockResolvedValue(0) as any;

      await TaskService.findAll({ status: "todo" });

      expect(mockedTask.find).toHaveBeenCalledWith(
        expect.objectContaining({ status: "todo", deletedAt: null })
      );
    });

    it("filters by priority", async () => {
      mockedTask.find.mockReturnValue({
        populate: () => ({ populate: () => ({ sort: () => ({ skip: () => ({ limit: () => Promise.resolve([]) }) }) }) })
      } as any);
      mockedTask.countDocuments = jest.fn().mockResolvedValue(0) as any;

      await TaskService.findAll({ priority: "high" });

      expect(mockedTask.find).toHaveBeenCalledWith(
        expect.objectContaining({ priority: "high" })
      );
    });
  });

  // --- findById ---
  describe("findById", () => {
    it("returns task when found", async () => {
      const mockTask: any = { title: "Found Task" };
      mockedTask.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockTask)
        })
      } as any);

      const result = await TaskService.findById("valid-id");

      expect(result).toEqual(mockTask);
    });

    it("throws 404 when task not found", async () => {
      mockedTask.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      } as any);

      await expect(TaskService.findById("invalid-id")).rejects.toThrow("Task not found");
    });
  });

  // --- update ---
  describe("update", () => {
    it("updates task fields correctly", async () => {
      const task: any = { title: "Old", save: jest.fn() };
      mockedTask.findOne.mockResolvedValue(task);

      await TaskService.update("123", { title: "New Title" });

      expect(task.title).toBe("New Title");
      expect(task.save).toHaveBeenCalled();
    });

    it("throws 404 when task not found for update", async () => {
      mockedTask.findOne.mockResolvedValue(null);

      await expect(TaskService.update("bad-id", {})).rejects.toThrow("Task not found");
    });
  });

  // --- delete ---
  describe("delete", () => {
    it("soft deletes task by setting deletedAt", async () => {
      const task: any = { deletedAt: null, save: jest.fn() };
      mockedTask.findById.mockResolvedValue(task);

      await TaskService.delete("123");

      expect(task.deletedAt).not.toBeNull();
      expect(task.save).toHaveBeenCalled();
    });

    it("throws error when task not found for delete", async () => {
      mockedTask.findById.mockResolvedValue(null);

      await expect(TaskService.delete("bad-id")).rejects.toThrow("Task not found");
    });
  });

  // --- addAttachment ---
  describe("addAttachment", () => {
    it("adds attachment to task", async () => {
      const task: any = {
        attachments: [],
        save: jest.fn()
      };
      task.attachments.push = jest.fn().mockImplementation((a: any) => task.attachments.splice(0, 0, a));
      mockedTask.findOne.mockResolvedValue(task);

      await TaskService.addAttachment("task-id", {
        filename: "file.pdf",
        path: "/uploads/file.pdf",
        size: 1024
      });

      expect(task.save).toHaveBeenCalled();
    });

    it("throws 404 if task not found when adding attachment", async () => {
      mockedTask.findOne.mockResolvedValue(null);

      await expect(
        TaskService.addAttachment("bad-id", {})
      ).rejects.toThrow("Task not found");
    });
  });

  // --- getAttachment ---
  describe("getAttachment", () => {
    it("returns correct attachment", async () => {
      const attachment = { _id: { toString: () => "att-id" }, filename: "file.pdf" };
      const task: any = { attachments: [attachment] };
      mockedTask.findOne.mockResolvedValue(task);

      const result = await TaskService.getAttachment("task-id", "att-id");

      expect(result).toEqual(attachment);
    });

    it("throws 404 if attachment not found", async () => {
      const task: any = { attachments: [] };
      mockedTask.findOne.mockResolvedValue(task);

      await expect(
        TaskService.getAttachment("task-id", "bad-att-id")
      ).rejects.toThrow("Attachment not found");
    });

    it("throws 404 if task not found when getting attachment", async () => {
      mockedTask.findOne.mockResolvedValue(null);

      await expect(
        TaskService.getAttachment("bad-task-id", "att-id")
      ).rejects.toThrow("Task not found");
    });
  });
});