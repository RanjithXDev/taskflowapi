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
      throw new Error('User not found');
    }

    user.name = data.name || user.name;
    user.role = data.role || user.role;

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