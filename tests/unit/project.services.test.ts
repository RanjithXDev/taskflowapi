/**
 * Unit tests for ProjectService (simple set)
 */
import { ProjectService } from "../../src/services/project.services";
import { Project } from "../../src/models/projects";

jest.mock("../../src/models/projects");
jest.mock("../../src/models/Task");

describe("ProjectService basic", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("create project returns created project", async () => {
    const mockProject = { name: "Test Project" };
    (Project.create as jest.Mock).mockResolvedValue(mockProject);

    const result = await ProjectService.create(mockProject);

    expect(Project.create).toHaveBeenCalledWith(mockProject);
    expect(result).toEqual(mockProject);
  });

  it("findAll returns projects", async () => {
    const mockProjects = [{ name: "P1" }];
    const populateMock = jest.fn().mockResolvedValue(mockProjects);
    (Project.find as jest.Mock).mockReturnValue({
      populate: () => ({ populate: populateMock })
    });

    const result = await ProjectService.findAll();

    expect(result).toEqual(mockProjects);
  });
});