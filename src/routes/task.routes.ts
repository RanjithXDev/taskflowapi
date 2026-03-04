import { Router } from 'express';
import {  createTask,  getTasks,  getTaskById,  updateTask,  deleteTask} from '../controllers/task.controllers';
import commentRoutes from './comment.routes';


const router = Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.use('/:taskId/comments', commentRoutes);

export default router;