import { User } from '../../src/models/User';
import bycrpt from 'bcryptjs';

describe("User Model testing ", ()=>{
    it('should create user with valid data', async () => {
        const user = await User.create({
            name : "Asdfgh",
            email : "test@gmail.com",
            password : "Test@123"
        });
        expect(user._id).toBeDefined();
    });
    it('should fail with invalid email', async () => {
    await expect(
      User.create({
        name: 'Test',
        email: 'invalid-email',
        password: 'password123'
      })
    ).rejects.toThrow();
  });
  it('should fail with invalid email', async () => {
    await expect(
      User.create({
        name: 'Test',
        email: 'invalid-email',
        password: 'password123'
      })
    ).rejects.toThrow();
  });

   it('should hash password before saving', async () => {
    const user = await User.create({
      name: 'Hash Test',
      email: 'hash@test.com',
      password: 'password123'
    });

    const found = await User.findOne({ email: 'hash@test.com' }).select('+password');

    expect(found?.password).not.toBe('password123');
    expect(await bycrpt.compare('password123', found!.password)).toBe(true);
  });

   it('should hash password before saving', async () => {
    const user = await User.create({
      name: 'Hash Test',
      email: 'hash@test.com',
      password: 'password123'
    });

    const found = await User.findOne({ email: 'hash@test.com' }).select('+password');

    expect(found?.password).not.toBe('password123');
    expect(await bycrpt.compare('password123', found!.password)).toBe(true);
  });

   it('comparePassword returns true for correct password', async () => {
    const user = await User.create({
      name: 'Compare Test',
      email: 'compare@test.com',
      password: 'password123'
    });

    const found = await User.findOne({ email: 'compare@test.com' }).select('+password');

    const result = await found!.comparePassword('password123');

    expect(result).toBe(true);
  });

  it('comparePassword returns false for incorrect password', async () => {
    const user = await User.create({
      name: 'Compare Test 2',
      email: 'compare2@test.com',
      password: 'password123'
    });

    const found = await User.findOne({ email: 'compare2@test.com' }).select('+password');

    const result = await found!.comparePassword('wrongpass');

    expect(result).toBe(false);
  });
})