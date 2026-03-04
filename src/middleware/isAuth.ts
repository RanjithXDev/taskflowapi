import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = header.split(' ')[1];

  try {

    const decoded: any = verifyAccessToken(token);

    (req as any).userId = decoded.userId;

    next();

  } catch {

    return res.status(401).json({
      message: 'Invalid token'
    });

  }

};