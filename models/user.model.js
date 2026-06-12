import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim:true,
      minLength:3,
      maxLength:20,
      lowecase:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true
    },
    password: {
      type: String,
      required: true,
      minLength:5,
      maxLength:10
    },
    role:{
      type:String,
      required:true,
      enum:['customer','serviceProvider','admin'],
      default:'customer' 
    }  ,
    firstname:{
      type:String,
      required:true,
      trim:true
    },
    lastname:{
      type:String,
      required:true,
      trim:true
    }
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
