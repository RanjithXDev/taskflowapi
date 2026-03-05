import mongoose from 'mongoose';
import app from './app';
import dotenv from "dotenv";
dotenv.config();

const PORT = 3000;

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);