import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.services';
import path from "path";
export const createUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {

    const data = req.body;

    
    if (req.file) {
      data.avatar = req.file.filename;
    }

    const user = await UserService.create(data);

    res.status(201).json(user);

  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserService.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {

  try {

    const data = req.body;

    // handle avatar upload
    if (req.file) {
      data.avatar = req.file.filename;
    }

    const user = await UserService.update(
      req.params.id,
      data
    );

    res.json(user);

  } catch (error) {
    next(error);
  }

};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.delete(req.params.id as string);
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
export const getAvatar = (
  req: Request<{ filename: string }>,
  res: Response
) => {

  const filePath = path.join(
    process.cwd(),
    "uploads",
    "avatars",
    req.params.filename
  );

  res.sendFile(filePath);
};