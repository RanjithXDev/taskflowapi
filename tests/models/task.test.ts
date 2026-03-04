import { Task } from '../../src/models/Task';
import { User } from '../../src/models/User';
import { Project } from '../../src/models/projects';
import { TaskService } from '@/services/task.services';

describe('Task Model', () => {

  let user: any;
  let project: any;

  beforeEach(async () => {
    user = await User.create({
      name: 'Task User',
      email: 'taskuser@test.com',
      password: 'password123'
    });

    project = await Project.create({
      name: 'Project 1',
      description: 'Test project',
      owner: user._id
    });
  });

  it('should create task with valid data', async () => {
    const task = await TaskService.create({
      title: 'Test Task',
      description: 'Task description',
      priority: 'high',
      assignee: user._id,
      project: project._id
    });

    expect(task._id).toBeDefined();
  });

  it('should fail if dueDate is in past', async () => {
    await expect(
      TaskService.create({
        title: 'Past Task',
        description: 'desc',
        priority: 'high',
        assignee: user._id,
        project: project._id,
        dueDate: new Date(Date.now() - 10000)
      })
    ).rejects.toThrow();
  });

  it('should auto-set completedAt when status is done', async () => {
    const task = await Task.create({
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