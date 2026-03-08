import mongoose from 'mongoose';
import app from './app';
import dotenv from "dotenv";
import http from "http";
import { initSocket, getIO} from './socket/socket';



dotenv.config();


const server = http.createServer(app);
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB Connected');
    initSocket(server);
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(console.error);

  const shutdown = async () => {

  console.log("Graceful shutdown");
    const io = getIO();
  io.close();

  await mongoose.connection.close();

  server.close(() => {
    process.exit(0);
  });

};