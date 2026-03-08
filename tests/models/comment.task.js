"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Comment_1 = require("../../src/models/Comment");
const User_1 = require("../../src/models/User");
const Task_1 = require("../../src/models/Task");
const projects_1 = require("../../src/models/projects");
describe('Comment Model', () => {
    it('should validate author and task refs', async () => {
        const user = await User_1.User.create({
            name: 'Comment User',
            email: 'comment@test.com',
            password: 'password123'
        });
        const project = await projects_1.Project.create({
            name: 'Proj',
            description: 'desc',
            owner: user._id
        });
        const task = await Task_1.Task.create({
            title: 'Task',
            description: 'desc',
            priority: 'low',
            assignee: user._id,
            project: project._id
        });
        const comment = await Comment_1.Comment.create({
            content: 'Test comment',
            author: user._id,
            task: task._id
        });
        expect(comment._id).toBeDefined();
    });
});
