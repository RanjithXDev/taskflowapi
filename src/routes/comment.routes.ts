import { Router } from 'express';
import {
  createComment,
  getCommentsByTask,
  deleteComment
} from '../controllers/comment.controller';
import validateRequest from '../middleware/validateRequest';
import {createCommentValidator } from '../validators/comment.validator';

const router = Router({ mergeParams: true });

router.post('/',createCommentValidator, validateRequest, createComment);
router.get('/', getCommentsByTask);
router.delete('/:id', deleteComment);

export default router;