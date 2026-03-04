import { Router } from 'express';
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} from '../controllers/user.controller';

import { isAuth } from '../middleware/isAuth';
import { isAdmin } from '../middleware/isAdmin';

const router = Router();

router.post('/', isAuth, isAdmin, createUser);

router.get('/', isAuth, getUsers);

router.put('/:id', isAuth, isAdmin, updateUser);

router.delete('/:id', isAuth, isAdmin, deleteUser);

export default router;