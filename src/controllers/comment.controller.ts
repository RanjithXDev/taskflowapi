import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.services';

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const comment = await CommentService.create({
      ...req.body,
      task: req.params.taskId
    });

    res.status(201).json(comment);

  } catch (error) {
    next(error);
  }
};

export const getCommentsByTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const comments = await CommentService.findByTask(req.params.taskId as string);

    res.status(200).json(comments);

  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    await CommentService.delete(req.params.id as string);

    res.status(200).json({ message: 'Comment deleted' });

  } catch (error) {
    next(error);
  }
};