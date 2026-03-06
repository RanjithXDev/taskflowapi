import multer from "multer";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg"
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PNG and JPG images are allowed"));
  }

  cb(null, true);
};

export const avatarUpload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter
});