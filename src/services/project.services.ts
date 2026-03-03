import { Project } from '../models/projects';

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

    if (!project) throw new Error('Project not found');

    return project;
  }

  static async update(id: string, data: any) {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');

    Object.assign(project, data);
    await project.save();
    return project;
  }

  static async delete(id: string) {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');

    await project.deleteOne();
    return project;
  }
}