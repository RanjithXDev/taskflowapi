import { Router, Request, Response } from 'express';

const router = Router();

/* -------------------------------
   START PAGE → LOGIN
-------------------------------- */

router.get('/', (req: Request, res: Response) => {
  res.redirect('/login');
});

/* -------------------------------
   AUTH PAGES
-------------------------------- */

router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

router.get('/signup', (req: Request, res: Response) => {
  res.render('signup');
});

/* -------------------------------
   MAIN DASHBOARD
-------------------------------- */

router.get('/dashboard', (req: Request, res: Response) => {
  res.render('dashboard');
});

/* -------------------------------
   UI PAGES
-------------------------------- */

router.get('/users-ui', (req: Request, res: Response) => {
  res.render('user');
});

router.get('/projects-ui', (req: Request, res: Response) => {
  res.render('projects');
});

router.get('/tasks-ui', (req: Request, res: Response) => {
  res.render('tasks');
});

router.get('/comments-ui', (req: Request, res: Response) => {
  res.render('comments');
});

router.get('/layout-ui', (req: Request, res: Response) => {
  res.render('layout');
});

export default router;