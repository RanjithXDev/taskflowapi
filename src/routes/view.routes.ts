import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/tasks-ui', (req, res) => {
  res.render('tasks');
});

export default router;