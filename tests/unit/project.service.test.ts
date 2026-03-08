import { ProjectService } from "../../src/services/project.services";
import { Project } from "../../src/models/projects";

jest.mock("../../src/models/projects");
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234-5678'
}));

describe("ProjectService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a project", async () => {

    const mockProject = { _id: "123", name: "Test Project", owner: "456" };
    (Project.create as jest.Mock).mockResolvedValue(mockProject);

    const result = await ProjectService.create({
      name: "Test Project",
      owner: "456"
    });

    expect(result).toEqual(mockProject);
    expect(Project.create).toHaveBeenCalled();

  });

  it("should find all projects", async () => {

    const mockProjects = [
      { _id: "1", name: "Project 1" },
      { _id: "2", name: "Project 2" }
    ];

    (Project.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProjects)
      })
    });

    const result = await ProjectService.findAll();

    expect(result).toEqual(mockProjects);

  });

  it("should find project by id", async () => {

    const mockProject = { _id: "123", name: "Test Project" };

    (Project.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProject)
      })
    });

    const result = await ProjectService.findById("123");

    expect(result).toEqual(mockProject);

  });

  it("should update a project", async () => {

    const mockProject = { 
      _id: "123", 
      name: "Old Project",
      save: jest.fn()
    };
    
    (Project.findById as jest.Mock).mockResolvedValue(mockProject);

    const result = await ProjectService.update("123", { name: "Updated Project" });

    expect(mockProject.save).toHaveBeenCalled();

  });

  it("should delete a project", async () => {

    const mockProject = { _id: "123", deleteOne: jest.fn() };
    (Project.findById as jest.Mock).mockResolvedValue(mockProject);

    const result = await ProjectService.delete("123");

    expect(mockProject.deleteOne).toHaveBeenCalled();

  });

});
