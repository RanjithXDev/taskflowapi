"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongo;
beforeAll(async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose_1.default.connect(uri);
});
afterEach(async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongo.stop();
});
