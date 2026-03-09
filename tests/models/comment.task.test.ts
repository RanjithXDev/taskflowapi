import { Comment } from '../../src/models/Comment';
import { User } from '../../src/models/User';
import { Task} from '../../src/models/Task';
import { Project } from '../../src/models/projects';


describe('Comment Model', () => {

  it('should validate author and task refs', async () => {
    const user = await User.create({
      name: 'Comment User',
      email: 'comment@test.com',
      password: 'password123'
    });

    const project = await Project.create({
      name: 'Proj',
      description: 'desc',
      owner: user._id
    });

    const task = await Task.create({
      title: 'Task',
      description: 'desc',
      priority: 'low',
      assignee: user._id,
      project: project._id
    });

    const comment = await Comment.create({
      content: 'Test comment',
      author: user._id,
      task: task._id
    });

    expect(comment._id).toBeDefined();
  });
});

