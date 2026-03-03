import { Router } from 'express';
import {
  createTask,
  getTasks,
  getOverdueTasks,
  getTasksByProject,
  getStatusCounts
} from '../controllers/task.controllers';

const router = Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/overdue', getOverdueTasks);
router.get('/project/:projectId', getTasksByProject);
router.get('/project/:projectId/status', getStatusCounts);

export default router;