import mongoose, { Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      minlength: 1,
      maxlength: 1000,
      trim: true
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task reference is required']
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);