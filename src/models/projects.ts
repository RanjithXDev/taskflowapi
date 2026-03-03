import mongoose, { Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  status: 'active' | 'completed' | 'archived';
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      minlength: 3,
      maxlength: 100,
      trim: true
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required']
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active'
    }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);