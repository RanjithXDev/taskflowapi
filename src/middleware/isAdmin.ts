import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const user = await User.findById((req as any).userId);

  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin only'
    });
  }

  next();
};