import express from "express";
import cors from "cors";
import { timeStamp } from "node:console";
import helmet from "helmet";
import path from "path";
import viewRoutes from "../src/routes/view.routes";
import healthRoutes from './routes/health.routes';
import { notFound } from "./middleware/notfound";
import { errorHandler } from "./middleware/errorhandler";


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', viewRoutes);

app.use('/api/health', healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app; 