"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_services_1 = require("../../src/services/project.services");
const projects_1 = require("../../src/models/projects");
jest.mock("../../src/models/projects");
describe("ProjectService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("create project", async () => {
        const mockProject = { name: "Test Project" };
        projects_1.Project.create.mockResolvedValue(mockProject);
        const result = await project_services_1.ProjectService.create(mockProject);
        expect(projects_1.Project.create).toHaveBeenCalledWith(mockProject);
        expect(result).toEqual(mockProject);
    });
    it("findAll returns projects", async () => {
        const mockProjects = [{ name: "P1" }];
        const populateMock = jest.fn().mockResolvedValue(mockProjects);
        projects_1.Project.find.mockReturnValue({
            populate: () => ({ populate: populateMock })
        });
        const result = await project_services_1.ProjectService.findAll();
        expect(result).toEqual(mockProjects);
    });
});
