import { Task } from '../models/Task';

export class TaskService {

  static async create(data: any) {
    if (data.dueDate && new Date(data.dueDate).getTime() < Date.now()) {
  throw new Error("Due date must be in the future");
}

  const task = await Task.create(data);

  return task;
  }

  static async findAll(query: any) {
    const { status, priority, assignee, page = 1, limit = 10 } = query;

    const filter: any = { deletedAt: null };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignee', 'name email')
        .populate('project', 'name')
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(filter)
    ]);

    return {
      data: tasks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  static async findById(id: string) {
    const task = await Task.findOne({ _id: id, deletedAt: null })
      .populate('assignee', 'name email')
      .populate('project', 'name');

    if (!task) {
      const err: any = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

    return task;
  }

  static async update(id: string, data: any) {
    const task = await Task.findOne({ _id: id, deletedAt: null });

    if (!task) {
      const err: any = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

    Object.assign(task, data);
    await task.save();

    return task;
  }

  
  static async delete(id: string) {
    const task = await Task.findById(id);

    if (!task) throw new Error('Task not found');

    task.deletedAt = new Date();
    await task.save();

    return task;
  }
  static async addAttachment(taskId: string, file: any) {

  const task = await Task.findOne({ _id: taskId, deletedAt: null });

  if (!task) {
    const err: any = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }

  const attachment = {
    filename: file.filename,
    path: file.path,
    size: file.size
  };

  task.attachments.push(attachment as any);

  await task.save();
  const savedAttachment = task.attachments[task.attachments.length - 1];
  return savedAttachment;
}
static async getAttachment(taskId: string, attachmentId: string) {

  const task = await Task.findOne({ _id: taskId, deletedAt: null });

  if (!task) {
    const err: any = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }

  const attachment = task.attachments.find(
    (a: any) => a._id.toString() === attachmentId
  );

  if (!attachment) {
    const err: any = new Error("Attachment not found");
    err.statusCode = 404;
    throw err;
  }

  return attachment;
}
}
