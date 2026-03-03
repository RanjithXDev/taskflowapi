import express from "express";
import cors from "cors";
import { timeStamp } from "node:console";


const app = express();

app.use(express.json());
app.use(cors());

app.get('api/health', (req, res, next)=>{
    res.status(200).json({
        status: 'ok',
        timeStamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use((req, res, next)=>{
    res.status(404).json({ message : "Page Not Found"});
});

export default app;