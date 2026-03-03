import { Comment } from '../models/Comment';
import { Task } from '../models/Task';

export class CommentService {

  static async create(data: any) {

    const task = await Task.findById(data.task);
    if (!task) {
      throw new Error('Task not found');
    }

    
    if (data.parent) {
      const parentComment = await Comment.findById(data.parent);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }

      if (parentComment.task.toString() !== data.task) {
        throw new Error('Parent comment does not belong to this task');
      }
    }

    return await Comment.create(data);
  }

  static async findByTask(taskId: string) {
    return await Comment.find({ task: taskId })
      .populate('author', 'name email')
      .populate('parent');
  }

  static async delete(id: string) {
    const comment = await Comment.findById(id);
    if (!comment) throw new Error('Comment not found');

    await comment.deleteOne();
    return comment;
  }
}