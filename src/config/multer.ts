import multer from "multer";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024 ;
const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.diskStorage({
    destination: (req , file, cb) => {
    cb(null, path.join(process.cwd(), "uploads/attachments"));
},
    filename: (req, file, cb)=>{
        const unique = Date.now() + "-" + file.originalname;
        cb(null, unique);
    },
});
const fileFilter = (req: any, file : any, cb:any)=>{
    if(!allowedTypes.includes(file.mimetype)){
        return cb(new Error("Invalid file type"));
    }
    cb(null, true);
};
export const uploadAttachment = multer({
    storage,
    limits: {fileSize: MAX_SIZE},
    fileFilter,
});