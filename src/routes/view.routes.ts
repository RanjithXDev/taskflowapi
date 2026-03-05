import { Router, Request, Response } from 'express';
import {isAuth} from '../middleware/isAuth';
const router = Router();


router.get('/', (req: Request, res: Response) => {
  res.redirect('/login');
});



router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

router.get('/signup', (req: Request, res: Response) => {
  res.render('signup');
});



router.get('/dashboard',isAuth, (req: Request, res: Response) => {
  res.render('dashboard');
});



router.get('/users-ui', isAuth,(req: Request, res: Response) => {
  res.render('user');
});

router.get('/projects-ui',isAuth, (req: Request, res: Response) => {
  res.render('projects');
});

router.get('/tasks-ui', isAuth,(req: Request, res: Response) => {
  res.render('tasks');
});

router.get('/comments-ui', isAuth,(req: Request, res: Response) => {
  res.render('comments');
});

router.get('/layout-ui',isAuth, (req: Request, res: Response) => {
  res.render('layout');
});

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

router.get("/reset/:token", (req, res) => {
  res.render("reset-password");
});

export default router;