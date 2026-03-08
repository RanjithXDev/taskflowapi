import mongoose from 'mongoose';
import app from './app';
import dotenv from "dotenv";
import http from "http";
import { initSocket } from './socket/socket';


dotenv.config();

const PORT = 3000;
const server = http.createServer(app);
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB Connected');
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);