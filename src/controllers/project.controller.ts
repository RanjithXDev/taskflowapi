import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.services';

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await ProjectService.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await ProjectService.findAll();
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await ProjectService.findById(req.params.id as string);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await ProjectService.update(req.params.id as string, req.body);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ProjectService.delete(req.params.id as string);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const tasks = await ProjectService.getProjectTasks(req.params.id as string);

    res.status(200).json(tasks);

  } catch (error) {
    next(error);
  }
};