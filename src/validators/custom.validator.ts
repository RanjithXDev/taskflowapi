import { Types } from "mongoose";
import { Project } from "../models/projects";
import { error } from "node:console";
import { User } from "../models/User";

export const IsValidObjectId = (value : string) =>{
    if(!Types.ObjectId.isValid(value)){
        throw new Error("Invalid Object Id");
    }
    return true;
};

export const isFutureDate = (  value : string) => {
    const date = new Date(value);
    if(date <= new Date()){
        throw new Error("Due date must be in future");
    }
    return true;
};

export const projectExists = async (value : string) =>{
    const project = await Project.findById(value);
    if(!project){
        throw  new Error("Project doesbn;t not exists");
    }
    return true;
};

export const validateTags = (tags : string[]) => {
    if(!tags) return true;
    if(!Array.isArray(tags)){
        throw  new Error ("Tags must be in array");
    }
    if(tags.length > 10){
        throw new Error ("Max 10  tasg allowed");
    }
    for(const tag of tags){
        if(tags.length > 30 ){
            throw new Error("Tag must be in the limit of 30 characters");
        }
    }
    return true;
};

export const userExist = async ( value: string) => {
 const user = await User.findById(value);
 if(!user){
    throw new Error("User doesn't exits");
 }
 return true;
};