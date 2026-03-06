import { Project } from '../models/projects';
import { Task } from '../models/Task';

export class ProjectService {

  static async create(data: any) {
    return await Project.create(data);
  }

  static async findAll() {
    return await Project.find()
      .populate('owner', 'name email')
      .populate('members', 'name email');
  }

  static async findById(id: string) {

    const project = await Project.findById(id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      const err: any = new Error("Project not found");
      err.statusCode = 404;
      throw err;
    }

    return project;
  }

  static async update(id: string, data: any) {

    const project = await Project.findById(id);

    if (!project) {
      const err: any = new Error("Project not found");
      err.statusCode = 404;
      throw err;
    }

    Object.assign(project, data);

    await project.save();

    return project;
  }

  static async delete(id: string) {

    const project = await Project.findById(id);

    if (!project) {
      const err: any = new Error("Project not found");
      err.statusCode = 404;
      throw err;
    }

    await project.deleteOne();

    return project;
  }

 
  static async getProjectTasks(projectId: string) {

    const project = await Project.findById(projectId);

    if (!project) {
      const err: any = new Error("Project not found");
      err.statusCode = 404;
      throw err;
    }

    const tasks = await Task.find({
      project: projectId,
      deletedAt: null
    })
    .populate('assignee', 'name email')
    .populate('project', 'name');

    return tasks;
  }

}