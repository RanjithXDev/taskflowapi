import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('dashboard');
});

router.get('/users-ui', (req, res) => {
  res.render('user');
});

router.get('/projects-ui', (req, res) => {
  res.render('projects');
});

router.get('/tasks-ui', (req, res) => {
  res.render('tasks');
});

router.get('/comments-ui', (req, res) => {
  res.render('comments');
});

router.get('/layout-ui', (req, res) => {
  res.render('layout');
});



export default router;