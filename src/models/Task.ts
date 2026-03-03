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
  findByProject(projectId: string, page?: number, limit?: number): Promise<ITask[]>;
  findOverdue(): Promise<ITask[]>;
  getStatusCounts(projectId: string): Promise<Record<string, number>>;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000
    },

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
          val.length <= 10 &&
          val.every(tag => tag.length <= 30),
        message: 'Max 10 tags, each max 30 characters'
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

//
// 🔹 Middleware
//
taskSchema.pre('save', function () {
  const task = this as ITask;

  if (task.isNew && task.dueDate && task.dueDate < new Date()) {
    throw new Error('Due date must be future');
  }

  if (task.isModified('status') && task.status === 'done') {
    task.completedAt = new Date();
  }
});

//
// 🔹 Static Methods
//
taskSchema.statics.findByProject = function (projectId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ project: projectId }).skip(skip).limit(limit);
};

taskSchema.statics.findOverdue = function () {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: 'done' }
  });
};

taskSchema.statics.getStatusCounts = async function (projectId) {
  const result = await this.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const counts: any = {
    todo: 0,
    'in-progress': 0,
    review: 0,
    done: 0
  };

  result.forEach(r => {
    counts[r._id] = r.count;
  });

  return counts;
};

export const Task = mongoose.model<ITask, TaskModel>('Task', taskSchema);