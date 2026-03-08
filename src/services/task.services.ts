import { Task } from '../models/Task';
import {User} from "../models/User";
import { sendEmail } from './email.services';
export class TaskService {

 static async create(data: any) {

  if (data.dueDate && new Date(data.dueDate).getTime() < Date.now()) {
    throw new Error("Due date must be in the future");
  }

  const task = await Task.create(data);

  // Send email to assigned user
  if (task.assignee) {

    const user = await User.findById(task.assignee);

    if (user) {

      await sendEmail(
        user.email,
        "New Task Assigned",
        `
        <h2>Task Assigned</h2>
        <p>Hello ${user.name},</p>

        <p>You have been assigned a new task.</p>

        <p><strong>Task:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>

        <p>Please login to TaskFlow to view the task.</p>
        `
      );

    }

  }

  return task;
}
  static async findAll(query: any) {

  const {
    status,
    priority,
    assignee,
    page = 1,
    limit = 10,
    cursor,
    sortBy = "createdAt",
    order = "asc"
  } = query;

  const filter: any = { deletedAt: null };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee) filter.assignee = assignee;

  const sortOrder = order === "desc" ? -1 : 1;


  if (cursor) {

    filter._id = { $gt: cursor };

    const tasks = await Task.find(filter)
      .populate("assignee", "name email")
      .populate("project", "name")
      .sort({ _id: 1 })
      .limit(Number(limit) + 1);

    const hasMore = tasks.length > Number(limit);

    if (hasMore) tasks.pop();

    const nextCursor =
      tasks.length > 0 ? tasks[tasks.length - 1]._id : null;

    return {
      data: tasks,
      nextCursor,
      hasMore,
      limit: Number(limit)
    };
  }

 

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);

  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("assignee", "name email")
      .populate("project", "name")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum),

    Task.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    data: tasks,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    hasMore: pageNum < totalPages
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
