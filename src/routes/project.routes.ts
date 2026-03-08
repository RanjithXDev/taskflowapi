import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks,
  generateProjectReport,
  exportTasksCSV
} from '../controllers/project.controller';
import {createProjectValidator, updateProjectValidator} from "../validators/project.validator"
import validateRequest from  "../middleware/validateRequest";
import { getTaskById } from '../controllers/task.controllers';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project APIs
 */
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create project
 *     tags: [Projects]
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', createProjectValidator, validateRequest, createProject);
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 */

router.get('/', getProjects);
/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 */
router.get('/:id', getProjectById);
/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project updated
 */
router.put('/:id',updateProjectValidator, validateRequest, updateProject);
/**
 * @swagger
 * /api/projects/{id}/report:
 *   get:
 *     summary: Generate project report
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project report generated
 */

 
router.get("/:id/report", generateProjectReport);
/**
 * @swagger
 * /api/projects/{id}/export:
 *   get:
 *     summary: Export project tasks as CSV
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV exported
 */
router.get("/:id/export", exportTasksCSV);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 * */
router.delete('/:id', deleteProject);

router.get('/:id/tasks', getProjectTasks);

export default router;