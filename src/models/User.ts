import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  verified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExp?: Date;

  comparePassword(candidate: string): Promise<boolean>;
  generateResetToken(): string;
  generateVerificationToken(): string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },

    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      trim: true
    },

    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin'
      },
      default: 'user'
    },

    avatar: {
      type: String
    },
    verified: {
     type: Boolean,
    default: false
    },

  verificationToken: {
  type: String
  },

    resetToken: {
      type: String
    },

    resetTokenExp: {
      type: Date
    }
  },
  {
    timestamps: true
  }
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
  this.resetTokenExp = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return token;
};
userSchema.methods.generateVerificationToken = function (): string {

  const token = crypto.randomBytes(32).toString('hex');

  this.verificationToken = token;

  return token;
};

export const User = mongoose.model<IUser>('User', userSchema);