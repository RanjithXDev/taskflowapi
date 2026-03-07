import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Project } from "../models/projects";

let io: Server;

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.use((socket, next) => {

    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Unauthorized"));

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

    const projects = await Project.find({
      members: userId
    });

    projects.forEach(project => {
      socket.join(project._id.toString());
    });

    console.log("User connected:", socket.id);

  });

};

export const getIO = () => {

  if (!io) throw new Error("Socket not initialized");

  return io;

};