import { Router } from 'express';
import {  createUser,  getUsers,  updateUser,  deleteUser} from '../controllers/user.controller';
import  validateRequest  from "../middleware/validateRequest";
import { isAuth } from '../middleware/isAuth';
import { isAdmin } from '../middleware/isAdmin';
import { updateUserValidator, createUserValidator } from '../validators/user.validator';

const router = Router();

router.post('/', createUserValidator, validateRequest, isAuth, isAdmin, createUser);

router.get('/', isAuth, getUsers);

router.put("/:id",updateUserValidator,validateRequest,updateUser);
router.delete('/:id', isAuth, isAdmin, deleteUser);

export default router;