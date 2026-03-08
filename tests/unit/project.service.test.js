"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_services_1 = require("../../src/services/project.services");
const projects_1 = require("../../src/models/projects");
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
        projects_1.Project.create.mockResolvedValue(mockProject);
        const result = await project_services_1.ProjectService.create({
            name: "Test Project",
            owner: "456"
        });
        expect(result).toEqual(mockProject);
        expect(projects_1.Project.create).toHaveBeenCalled();
    });
    it("should find all projects", async () => {
        const mockProjects = [
            { _id: "1", name: "Project 1" },
            { _id: "2", name: "Project 2" }
        ];
        projects_1.Project.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProjects)
            })
        });
        const result = await project_services_1.ProjectService.findAll();
        expect(result).toEqual(mockProjects);
    });
    it("should find project by id", async () => {
        const mockProject = { _id: "123", name: "Test Project" };
        projects_1.Project.findById.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProject)
            })
        });
        const result = await project_services_1.ProjectService.findById("123");
        expect(result).toEqual(mockProject);
    });
    it("should update a project", async () => {
        const mockProject = {
            _id: "123",
            name: "Old Project",
            save: jest.fn()
        };
        projects_1.Project.findById.mockResolvedValue(mockProject);
        const result = await project_services_1.ProjectService.update("123", { name: "Updated Project" });
        expect(mockProject.save).toHaveBeenCalled();
    });
    it("should delete a project", async () => {
        const mockProject = { _id: "123", deleteOne: jest.fn() };
        projects_1.Project.findById.mockResolvedValue(mockProject);
        const result = await project_services_1.ProjectService.delete("123");
        expect(mockProject.deleteOne).toHaveBeenCalled();
    });
});
