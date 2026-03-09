/**
 * Comprehensive unit tests for ProjectService
 */
import { ProjectService } from "../../src/services/project.services";
import { Project } from "../../src/models/projects";
import { Task } from "../../src/models/Task";

jest.mock("../../src/models/projects");
jest.mock("../../src/models/Task");

describe("ProjectService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("creates a project with provided data", async () => {
      const mockProject = { _id: "proj-id", name: "Test Project", owner: "user-id" };
      (Project.create as jest.Mock).mockResolvedValue(mockProject);

      const result = await ProjectService.create({ name: "Test Project", owner: "user-id" });

      expect(Project.create).toHaveBeenCalledWith({ name: "Test Project", owner: "user-id" });
      expect(result).toEqual(mockProject);
    });
  });

  describe("findAll", () => {
    it("returns all projects with populated fields", async () => {
      const mockProjects = [{ _id: "1", name: "P1" }, { _id: "2", name: "P2" }];
      (Project.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockProjects)
        })
      });

      const result = await ProjectService.findAll();

      expect(result).toEqual(mockProjects);
    });
  });

  describe("findById", () => {
    it("returns project when found", async () => {
      const mockProject = { _id: "123", name: "Found Project" };
      (Project.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockProject)
        })
      });

      const result = await ProjectService.findById("123");

      expect(result).toEqual(mockProject);
    });

    it("throws 404 when project not found", async () => {
      (Project.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await expect(ProjectService.findById("bad-id")).rejects.toThrow("Project not found");
    });
  });

  describe("update", () => {
    it("updates project and saves", async () => {
      const mockProject = { _id: "123", name: "Old", save: jest.fn() };
      (Project.findById as jest.Mock).mockResolvedValue(mockProject);

      await ProjectService.update("123", { name: "Updated" });

      expect(mockProject.save).toHaveBeenCalled();
      expect(mockProject.name).toBe("Updated");
    });

    it("throws 404 when project not found for update", async () => {
      (Project.findById as jest.Mock).mockResolvedValue(null);

      await expect(ProjectService.update("bad-id", {})).rejects.toThrow("Project not found");
    });
  });

  describe("delete", () => {
    it("calls deleteOne on project", async () => {
      const mockProject = { _id: "123", deleteOne: jest.fn().mockResolvedValue({}) };
      (Project.findById as jest.Mock).mockResolvedValue(mockProject);

      const result = await ProjectService.delete("123");

      expect(mockProject.deleteOne).toHaveBeenCalled();
      expect(result).toEqual(mockProject);
    });

    it("throws 404 when project not found for delete", async () => {
      (Project.findById as jest.Mock).mockResolvedValue(null);

      await expect(ProjectService.delete("bad-id")).rejects.toThrow("Project not found");
    });
  });

  describe("getProjectTasks", () => {
    it("returns tasks for a project", async () => {
      const mockProject = { _id: "proj-id", name: "Project" };
      const mockTasks = [{ title: "Task 1" }, { title: "Task 2" }];

      (Project.findById as jest.Mock).mockResolvedValue(mockProject);
      (Task.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockTasks)
        })
      });

      const result = await ProjectService.getProjectTasks("proj-id");

      expect(result).toEqual(mockTasks);
    });

    it("throws 404 when project not found in getProjectTasks", async () => {
      (Project.findById as jest.Mock).mockResolvedValue(null);

      await expect(ProjectService.getProjectTasks("bad-id")).rejects.toThrow("Project not found");
    });
  });
});
