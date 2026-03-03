import mongoose from "mongoose";
import app from './app';


const PORT = 3000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow')
    .then(()=>{
        app.listen(PORT, ()=>{
            console.log(`server is running on the port: ${PORT}`);
        });
    }).catch((err)=>{
        console.log("MongoDB connection error");
    });
