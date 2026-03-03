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
}

interface TaskModel extends Model<ITask> {
  findByProject(projectId: string, page: number, limit: number): Promise<ITask[]>;
  findOverdue(): Promise<ITask[]>;
  getStatusCounts(projectId: string): Promise<any>;
}

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
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    tags: {
      type: [String],
      validate: {
        validator: (val: string[]) =>
          val.length <= 10 && val.every(tag => tag.length <= 30),
        message: 'Invalid tags'
      }
    },
    dueDate: Date,
    attachments: [
      {
        filename: String,
        path: String,
        size: Number
      }
    ],
    completedAt: Date
  },
  { timestamps: true }
);


taskSchema.pre('save', function (next) {
  if (this.dueDate && this.dueDate < new Date()) {
    return next(new Error('Due date must be in the future'));
  }

  if (this.status === 'done') {
    this.completedAt = new Date();
  }

  next();
});

taskSchema.statics.findByProject = function (
  projectId: string,
  page: number,
  limit: number
) {
  return this.find({ project: projectId })
    .skip((page - 1) * limit)
    .limit(limit);
};

taskSchema.statics.findOverdue = function () {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: 'done' }
  });
};

taskSchema.statics.getStatusCounts = function (projectId: string) {
  return this.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
};

export const Task = mongoose.model<ITask, TaskModel>('Task', taskSchema);