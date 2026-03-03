import mongoose, { Document, Model } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  tags: string[];
  dueDate?: Date;
  attachments: {
    filename: string;
    path: string;
    size: number;
  }[];
  completedAt?: Date;
  deletedAt?: Date;   
}

interface TaskModel extends Model<ITask> {}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'done'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      required: true
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    tags: [String],
    dueDate: Date,
    attachments: [{ filename: String, path: String, size: Number }],
    completedAt: Date,
    deletedAt: { type: Date, default: null }   
  },
  { timestamps: true }
);

taskSchema.pre('save', function () {
  const task = this as ITask;

  if (task.isModified('status') && task.status === 'done') {
    task.completedAt = new Date();
  }
});

export const Task = mongoose.model<ITask, TaskModel>('Task', taskSchema);