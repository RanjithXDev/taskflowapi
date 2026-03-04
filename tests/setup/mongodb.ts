import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo : MongoMemoryServer;

export const connect = async () =>{
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
};

export const closeDB = async () =>{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoose.stop();
};

export const clearDB = async () =>{
    const col = mongoose.connection.collections;

    for (const key in col){
        await col[key].deleteMany({});
    }
};