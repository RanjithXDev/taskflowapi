import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import viewRoutes from "./routes/view.routes";
import healthRoutes from "./routes/health.routes";

import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import projectRoutes from "./routes/project.routes";
import commentRoutes from "./routes/comment.routes";
import authRoutes from "./routes/auth.routes";

import { notFound } from "./middleware/notfound";
import { errorHandler } from "./middleware/errorhandler";
import { requestLogger } from "./middleware/logger";
import { requestIdMiddleware } from "./middleware/requestID";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger);
app.use(requestIdMiddleware);
app.use(compression()); 
app.use(morgan("dev")); 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  express.static(
    path.join(process.cwd(), "src/public")
  )
);

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

app.use("/", viewRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/health", healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;