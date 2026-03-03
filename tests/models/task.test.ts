import { Task } from '../../src/models/Task';
import { User } from '../../src/models/User';
import { Project } from '../../src/models/projects';

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
    const task = await Task.create({
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
      Task.create({
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

  it('findOverdue returns only overdue tasks', async () => {
    const featureDate = new Date(Date.now() + 100000)
    const task = await Task.create({
      title: 'overdue',
      description: 'desc',
      priority: 'low',
      assignee: user._id,
      project: project._id,
      dueDate: featureDate
    });

    await Task.updateOne(
        {_id : task.id},
        {dueDate: new Date(Date.now() - 10000)}
    );
    const overdue = await Task.findOverdue();
    expect(overdue.length).toBe(1);
    expect(overdue[0].title).toBe('overdue');
});

  it('getStatusCounts returns correct for todo status', async () => {
    await Task.create({
      title: 'Task 1',
      description: 'desc',
      priority: 'low',
      status: 'todo',
      assignee: user._id,
      project: project._id
    });

    const counts = await Task.getStatusCounts(project._id.toString());

    expect(counts.todo).toBe(1);
  });
});