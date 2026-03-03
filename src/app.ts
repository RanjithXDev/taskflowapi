import express from "express";
import cors from "cors";
import { timeStamp } from "node:console";
import helmet from "helmet";
import path from "path";
import viewRoutes from "../src/routes/view.routes";
import healthRoutes from './routes/health.routes';
import { notFound } from "./middleware/notfound";
import { errorHandler } from "./middleware/errorhandler";
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import projectRoutes from './routes/project.routes';
import commentRoutes from './routes/comment.routes';


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(
  express.static(
    path.join(process.cwd(), 'src/public')
  )
);
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));

app.use('/', viewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/health', healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app; 