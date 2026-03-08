import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Project } from "../models/projects";   // adjust path if needed

let io: Server;

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.use((socket, next) => {
    if (process.env.NODE_ENV === "test") {
    return next();
  }
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET!
      );

      socket.data.userId = decoded.userId;

      next();

    } catch {

      next(new Error("Invalid token"));

    }

  });

  io.on("connection", async (socket) => {

    const userId = socket.data.userId;

    try {

      const projects = await Project.find({
        members: userId
      });

      projects.forEach(project => {
        socket.join(project._id.toString());
      });

      

    } catch (err) {
      console.error("Socket room join error:", err);
    }

  });

};

export const getIO = () => {

  if (!io) throw new Error("Socket not initialized");

  return io;

};