import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  resetToken?: string;
  resetTokenExp?: Date;

  comparePassword(candidate: string): Promise<boolean>;
  generateResetToken(): string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false 
    },

    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    avatar: String,
    resetToken: String,
    resetTokenExp: Date
  },
  { timestamps: true }
);
userSchema.pre('save', async function () {
  const user = this as IUser;

  if (!user.isModified('password')) return;

  user.password = await bcrypt.hash(user.password, 12);
});


userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.generateResetToken = function (): string {
  const token = crypto.randomBytes(32).toString('hex');

  this.resetToken = token;
  this.resetTokenExp = new Date(Date.now() + 10 * 60 * 1000);

  return token;
};

export const User = mongoose.model<IUser>('User', userSchema);