import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks
} from '../controllers/project.controller';
import {createProjectValidator, updateProjectValidator} from "../validators/project.validator"
import validateRequest from  "../middleware/validateRequest";
import { getTaskById } from '../controllers/task.controllers';

const router = Router();

router.post('/', createProjectValidator, validateRequest, createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id',updateProjectValidator, validateRequest, updateProject);
router.delete('/:id', deleteProject);

router.get('/:id/tasks', getProjectTasks);

export default router;