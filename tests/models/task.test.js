"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("../../src/models/Task");
const User_1 = require("../../src/models/User");
const projects_1 = require("../../src/models/projects");
const task_services_1 = require("@/services/task.services");
describe('Task Model', () => {
    let user;
    let project;
    beforeEach(async () => {
        user = await User_1.User.create({
            name: 'Task User',
            email: 'taskuser@test.com',
            password: 'password123'
        });
        project = await projects_1.Project.create({
            name: 'Project 1',
            description: 'Test project',
            owner: user._id
        });
    });
    it('should create task with valid data', async () => {
        const task = await task_services_1.TaskService.create({
            title: 'Test Task',
            description: 'Task description',
            priority: 'high',
            assignee: user._id,
            project: project._id
        });
        expect(task._id).toBeDefined();
    });
    it('should fail if dueDate is in past', async () => {
        await expect(task_services_1.TaskService.create({
            title: 'Past Task',
            description: 'desc',
            priority: 'high',
            assignee: user._id,
            project: project._id,
            dueDate: new Date(Date.now() - 10000)
        })).rejects.toThrow();
    });
    it('should auto-set completedAt when status is done', async () => {
        const task = await Task_1.Task.create({
            title: 'Done Task',
            description: 'desc',
            priority: 'medium',
            status: 'done',
            assignee: user._id,
            project: project._id
        });
        expect(task.completedAt).toBeInstanceOf(Date);
    });
});
