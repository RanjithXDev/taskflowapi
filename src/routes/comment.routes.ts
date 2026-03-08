import { Router } from 'express';
import {
  createComment,
  getCommentsByTask,
  deleteComment
} from '../controllers/comment.controller';
import validateRequest from '../middleware/validateRequest';
import {createCommentValidator } from '../validators/comment.validator';

const router = Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment APIs
 */

/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   post:
 *     summary: Create comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Comment created
 */

router.post('/',createCommentValidator, validateRequest, createComment);
/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   get:
 *     summary: Get comments for a task
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */

router.get('/', getCommentsByTask);
/**
 * @swagger
 * /api/tasks/{taskId}/comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/:id', deleteComment);

export default router;