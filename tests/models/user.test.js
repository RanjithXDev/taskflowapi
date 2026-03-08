"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../src/models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
describe("User Model testing ", () => {
    it('should create user with valid data', async () => {
        const user = await User_1.User.create({
            name: "Asdfgh",
            email: "test@gmail.com",
            password: "Test@123"
        });
        expect(user._id).toBeDefined();
    });
    it('should fail with invalid email', async () => {
        await expect(User_1.User.create({
            name: 'Test',
            email: 'invalid-email',
            password: 'password123'
        })).rejects.toThrow();
    });
    it('should fail with invalid email', async () => {
        await expect(User_1.User.create({
            name: 'Test',
            email: 'invalid-email',
            password: 'password123'
        })).rejects.toThrow();
    });
    it('should hash password before saving', async () => {
        const user = await User_1.User.create({
            name: 'Hash Test',
            email: 'hash@test.com',
            password: 'password123'
        });
        const found = await User_1.User.findOne({ email: 'hash@test.com' }).select('+password');
        expect(found?.password).not.toBe('password123');
        expect(await bcryptjs_1.default.compare('password123', found.password)).toBe(true);
    });
    it('should hash password before saving', async () => {
        const user = await User_1.User.create({
            name: 'Hash Test',
            email: 'hash@test.com',
            password: 'password123'
        });
        const found = await User_1.User.findOne({ email: 'hash@test.com' }).select('+password');
        expect(found?.password).not.toBe('password123');
        expect(await bcryptjs_1.default.compare('password123', found.password)).toBe(true);
    });
    it('comparePassword returns true for correct password', async () => {
        const user = await User_1.User.create({
            name: 'Compare Test',
            email: 'compare@test.com',
            password: 'password123'
        });
        const found = await User_1.User.findOne({ email: 'compare@test.com' }).select('+password');
        const result = await found.comparePassword('password123');
        expect(result).toBe(true);
    });
    it('comparePassword returns false for incorrect password', async () => {
        const user = await User_1.User.create({
            name: 'Compare Test 2',
            email: 'compare2@test.com',
            password: 'password123'
        });
        const found = await User_1.User.findOne({ email: 'compare2@test.com' }).select('+password');
        const result = await found.comparePassword('wrongpass');
        expect(result).toBe(false);
    });
});
