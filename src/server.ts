import mongoose from 'mongoose';
import app from './app';

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/taskflow')
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);