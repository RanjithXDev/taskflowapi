import { User } from '../models/User';

export class UserService {

  static async create(data: any) {
    return await User.create(data);
  }

  static async findAll() {
    return await User.find().select('-password');
  }

  static async update(id: string, data: any) {

  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email;
  if (data.role !== undefined) user.role = data.role;

  
  if (data.avatar !== undefined) {
    user.avatar = data.avatar;
  }

  await user.save();

  return user;
}

  static async delete(id: string) {
    const user = await User.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    await user.deleteOne();
    return user;
  }
}