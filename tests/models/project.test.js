"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const projects_1 = require("../../src/models/projects");
const User_1 = require("../../src/models/User");
describe('Project Model', () => {
    it('should validate owner reference', async () => {
        const user = await User_1.User.create({
            name: 'Owner',
            email: 'owner@test.com',
            password: 'password123'
        });
        const project = await projects_1.Project.create({
            name: 'Proj',
            description: 'desc',
            owner: user._id
        });
        expect(project.owner).toBeDefined();
    });
});
