import { Router } from 'express';
import {
  createComment,
  getCommentsByTask,
  deleteComment
} from '../controllers/comment.controller';

const router = Router({ mergeParams: true });

router.post('/', createComment);
router.get('/', getCommentsByTask);
router.delete('/:id', deleteComment);

export default router;