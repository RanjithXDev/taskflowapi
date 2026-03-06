import { Request, Response } from "express";
import {Task} from "../models/Task";

export const uploadTaskAttachment = async (req : Request , res: Response) => {
    const taskId = req.params.id;
    const file = req.file;
    if(!file){
        return res.status(400).json({message: "No file uploaded"});
    }
    const task = await Task.findById(taskId);
    if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const attachment = {
    filename: file.filename,
    path: file.path,
    size: file.size
  };

  task.attachments.push(attachment);

  await task.save();

  res.status(201).json({
    message: "File uploaded",
    attachment
  });
}

export const downloadAttachment = async (req: Request, res: Response) => {

 const { id, attachmentId } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const attachment = task.attachments.find(
    (att: any) => att._id.toString() === attachmentId
  );

  if (!attachment) {
    return res.status(404).json({ message: "Attachment not found" });
  }

  res.download(attachment.path, attachment.filename);
};