import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io: Server;

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.use((socket, next) => {

    const token = socket.handshake.auth.token;

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

  io.on("connection", (socket) => {

    socket.on("joinProject", (projectId: string) => {

      socket.join(projectId);

    });

  });
};

export const getIO = () => {

  if (!io) throw new Error("Socket not initialized");

  return io;
};