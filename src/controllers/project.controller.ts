import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.services';
import PDFDocument from "pdfkit";
import { Task } from '../models/Task';
import {Project} from "../models/projects";
import { Parser } from "json2csv";

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

export const generateProjectReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const projectId = req.params.id;

    const project = await Project
      .findById(projectId)
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await Task.find({ project: projectId });

    const statusCounts: any = {
      todo: 0,
      "in-progress": 0,
      review: 0,
      done: 0
    };

    tasks.forEach(task => {
      statusCounts[task.status]++;
    });

    const overdueTasks = tasks.filter(
      t => t.dueDate && t.dueDate < new Date() && t.status !== "done"
    );

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=project-${projectId}-report.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("Project Report", { align: "center" });

    doc.moveDown();

    doc.fontSize(14).text(`Project Name: ${project.name}`);

    doc.moveDown();

    doc.text("Members:");

    project.members.forEach((m: any) => {
      doc.text(`- ${m.name} (${m.email})`);
    });

    doc.moveDown();

    doc.text("Task Status Counts:");

    Object.keys(statusCounts).forEach(status => {
      doc.text(`${status}: ${statusCounts[status]}`);
    });

    doc.moveDown();

    doc.text("Overdue Tasks:");

    overdueTasks.forEach(task => {
      doc.text(`- ${task.title} (Due: ${task.dueDate})`);
    });

    doc.end();

  } catch (error) {
    next(error);
  }
};

export const exportTasksCSV = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    if (req.query.format !== "csv") {
      return res.status(400).json({
        message: "Invalid format. Only CSV supported"
      });
    }
    
    const projectId = req.params.id;

    const tasks = await Task
      .find({ project: projectId })
      .populate("assignee", "name email");

    const data = tasks.map(task => ({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee:  (task.assignee as any)?.name,
      dueDate: task.dueDate
    }));

    const parser = new Parser();

    const csv = parser.parse(data);

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment(`project-${projectId}-tasks.csv`);

    res.send(csv);

  } catch (error) {
    next(error);
  }
};