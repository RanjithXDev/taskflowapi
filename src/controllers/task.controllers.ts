import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.services';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TaskService.findAll(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.findById(req.params.id as string );
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.update(req.params.id as string, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.delete(req.params.id as string  );
    res.json({ message: 'Task soft deleted', task });
  } catch (error) {
    next(error);
  }
};