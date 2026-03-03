import { Request, Response } from 'express';
import { Task } from '../models/Task';

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTasks = async (_req: Request, res: Response) => {
  const tasks = await Task.find()
    .populate('assignee', 'name email')
    .populate('project', 'name');

  res.json(tasks);
};

export const getOverdueTasks = async (_req: Request, res: Response) => {
  const tasks = await Task.findOverdue();
  res.json(tasks);
};

export const getTasksByProject = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  const tasks = await Task.findByProject(
    req.params.projectId,
    Number(page),
    Number(limit)
  );

  res.json(tasks);
};

export const getStatusCounts = async (req: Request, res: Response) => {
  const counts = await Task.getStatusCounts(req.params.projectId);
  res.json(counts);
};