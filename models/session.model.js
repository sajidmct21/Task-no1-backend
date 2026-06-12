import mongoose from "mongoose";
import { User } from "./user.model.js";
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Session = mongoose.model("Session", sessionSchema);
