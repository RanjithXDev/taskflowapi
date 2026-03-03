import { Request, Response, NextFunction } from "express";

export const notFound = (
    req: Request,
    res: Response,
) =>{
    res.status(404).json({
        status: "Fail",
        message: "Route Not Found"
    });
};