import { Router } from 'express';
import {  createUser,  getUsers,  updateUser,  deleteUser, getAvatar} from '../controllers/user.controller';
import  validateRequest  from "../middleware/validateRequest";
import { isAuth } from '../middleware/isAuth';
import { isAdmin } from '../middleware/isAdmin';
import { avatarUpload } from '../config/avatarUpload';
import { updateUserValidator, createUserValidator } from '../validators/user.validator';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User APIs
 */
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', avatarUpload.single("avatar"),createUserValidator, validateRequest, isAuth, isAdmin, createUser);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', isAuth, getUsers);
/**
 * @swagger
 * /api/users/avatar/{filename}:
 *   get:
 *     summary: Get user avatar
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Avatar image
 */
router.get("/avatar/:filename", getAvatar);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/:id",avatarUpload.single("avatar") ,updateUserValidator,validateRequest,updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', isAuth, isAdmin, deleteUser);

export default router;