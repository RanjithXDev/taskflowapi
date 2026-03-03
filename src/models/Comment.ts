import mongoose, { Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);