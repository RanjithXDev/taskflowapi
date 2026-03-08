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
 * tags:
 *   name: Tasks
 *   description: Task APIs
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/',createTaskValidator, validateRequest, createTask);
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', getTasks);
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 */
router.get('/:id', getTaskById);
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put('/:id',updateTaskValidator, validateRequest, updateTask);
/**
 * @swagger
 * /api/tasks/{id}/attachments:
 *   post:
 *     summary: Upload task attachment
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attachment uploaded
 */
router.post("/:id/attachments", uploadAttachment.single("file"), uploadTaskAttachment);
/**
 * @swagger
 * /api/tasks/{id}/attachments/{attachmentId}:
 *   get:
 *     summary: Download task attachment
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attachment downloaded
 */
router.get("/:id/attachments/:attachmentId", downloadTaskAttachment);
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete('/:id', deleteTask);

router.use('/:taskId/comments', commentRoutes);

export default router;