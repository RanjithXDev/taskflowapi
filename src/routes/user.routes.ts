import { Router } from 'express';
import {  createUser,  getUsers,  updateUser,  deleteUser, getAvatar} from '../controllers/user.controller';
import  validateRequest  from "../middleware/validateRequest";
import { isAuth } from '../middleware/isAuth';
import { isAdmin } from '../middleware/isAdmin';
import { avatarUpload } from '../config/avatarUpload';
import { updateUserValidator, createUserValidator } from '../validators/user.validator';

const router = Router();

router.post('/', avatarUpload.single("avatar"),createUserValidator, validateRequest, isAuth, isAdmin, createUser);

router.get('/', isAuth, getUsers);
router.get("/avatar/:filename", getAvatar);
router.put("/:id",avatarUpload.single("avatar") ,updateUserValidator,validateRequest,updateUser);
router.delete('/:id', isAuth, isAdmin, deleteUser);

export default router;