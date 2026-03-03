import { Project } from '../../src/models/projects';
import { User } from '../../src/models/User';

describe('Project Model', () => {
  it('should validate owner reference', async () => {
    const user = await User.create({
      name: 'Owner',
      email: 'owner@test.com',
      password: 'password123'
    });

    const project = await Project.create({
      name: 'Proj',
      description: 'desc',
      owner: user._id
    });

    expect(project.owner).toBeDefined();
  });
});