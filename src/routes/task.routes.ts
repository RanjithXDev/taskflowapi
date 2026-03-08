import { Router } from 'express';
import {  createTask,  getTasks,  getTaskById,  updateTask,  deleteTask} from '../controllers/task.controllers';
import commentRoutes from './comment.routes';
import { createTaskValidator, updateTaskValidator} from "../validators/task.validator";
import validateRequest from '../middleware/validateRequest';
import { uploadAttachment } from '../config/multer';
import {uploadTaskAttachment , downloadTaskAttachment} from '../controllers/task.controllers';

const router = Router();
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               assignee:
 *                 type: string
 *               project:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/',createTaskValidator, validateRequest, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id',updateTaskValidator, validateRequest, updateTask);
router.post("/:id/attachments", uploadAttachment.single("file"), uploadTaskAttachment);
router.get("/:id/attachments/:attachmentId", downloadTaskAttachment);
router.delete('/:id', deleteTask);

router.use('/:taskId/comments', commentRoutes);

export default router;