import { Request, Response } from 'express';
import { Comment } from '../models/Comment';

export const createComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCommentsByTask = async (req: Request, res: Response) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate('author', 'name email')
    .populate('parent');

  res.json(comments);
};