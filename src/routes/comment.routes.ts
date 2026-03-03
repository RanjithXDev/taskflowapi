import { Router } from 'express';
import {
  createComment,
  getCommentsByTask
} from '../controllers/comment.controller';

const router = Router();

router.post('/', createComment);
router.get('/task/:taskId', getCommentsByTask);

export default router;