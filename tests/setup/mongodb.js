"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDB = exports.closeDB = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongo;
const connect = async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose_1.default.connect(uri);
};
exports.connect = connect;
const closeDB = async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    await mongoose_1.default.stop();
};
exports.closeDB = closeDB;
const clearDB = async () => {
    const col = mongoose_1.default.connection.collections;
    for (const key in col) {
        await col[key].deleteMany({});
    }
};
exports.clearDB = clearDB;
