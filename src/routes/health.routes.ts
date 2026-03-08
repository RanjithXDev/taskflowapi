import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check API
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check server health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;