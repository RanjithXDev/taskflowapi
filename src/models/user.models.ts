import mongoose from "mongoose";
import { reset } from "supertest/lib/cookies";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
     type: String,   
     required: false,
     default: null
  },
    role: {
        type : String,
        enum: ["user", "admin"],
        default: "user"
    },

    resetToken: String,
    resetTokenExpiry: Date
}, { timestamps: true});

export default mongoose.model("user", userSchema);