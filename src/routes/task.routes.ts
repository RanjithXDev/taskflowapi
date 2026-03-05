import { Router } from 'express';
import {  createTask,  getTasks,  getTaskById,  updateTask,  deleteTask} from '../controllers/task.controllers';
import commentRoutes from './comment.routes';
import { createTaskValidator, updateTaskValidator} from "../validators/task.validator";
import validateRequest from '../middleware/validateRequest';

const router = Router();

router.post('/',createTaskValidator, validateRequest, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id',updateTaskValidator, validateRequest, updateTask);
router.delete('/:id', deleteTask);

router.use('/:taskId/comments', commentRoutes);

export default router;