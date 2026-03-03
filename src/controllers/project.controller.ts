import { Request, Response } from 'express';
import { Project } from '../models/projects';

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjects = async (_req: Request, res: Response) => {
  const projects = await Project.find()
    .populate('owner', 'name email')
    .populate('members', 'name email');

  res.json(projects);
};