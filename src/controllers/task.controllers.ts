import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.services';
import {getIO} from "../socket/socket";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskService.create(req.body);
    const io = getIO();
    io.to(task.project.toString()).emit("task: created", task);
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

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const task = await TaskService.update(
      req.params.id as string,
      req.body
    );

    const io = getIO();

    io.to(task.project.toString()).emit("task:updated", task);

    if (req.body.status) {
      io.to(task.project.toString()).emit(
        "task:status-changed",
        task
      );
    }

    if (req.body.assignee) {
      io.to(task.project.toString()).emit(
        "task:assigned",
        task
      );
    }

    res.json(task);

  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const task = await TaskService.delete(req.params.id as string);

    const io = getIO();

    io.to(task.project.toString()).emit("task:updated", task);

    res.json({
      message: "Task soft deleted",
      task
    });

  } catch (error) {
    next(error);
  }
};

export const uploadTaskAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const attachment =
      await TaskService.addAttachment(
        req.params.id as string,
        req.file
      );

    res.status(201).json({
      message: "Attachment uploaded",
      attachment
    });

  } catch (error) {
    next(error);
  }
};

export const downloadTaskAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const attachment =
      await TaskService.getAttachment(
        req.params.id as string,
        req.params.attachmentId as string
      );

    res.download(
      attachment.path,
      attachment.filename
    );

  } catch (error) {
    next(error);
  }
};