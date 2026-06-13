import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Session } from "../models/session.model.js";

export const register = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, username, email, password, role } = req.body;

  const existingUser = await User.findOne({ username });
  const existingemail = await User.findOne({ email });

  if (existingUser) {
    //   return res.status(400).json({ message: "User already exist" });
    throw new ApiError(400, "User already exist");
  }
  if (username.length < 3) {
    //   return res
    //     .status(400)
    //     .json({ message: "Username should atleast 4 characters" });
    throw new ApiError(400, "Username should atleast 3 characters");
  }
  if (existingemail) {
    //   return res.status(400).json({ message: "Email already exist" });
    throw new ApiError(400, "Email already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    firstname,
    lastname,
    role,
    username,
    email,
    password: hashPassword,
  });
  await newUser.save();

  // return res.status(200).json({ message: "Signin successfully" });
  res.status(201).json(new ApiResponse(201, "User is Created", newUser));
});

export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const exsistingUser = await User.findOne({ username });
  if (!exsistingUser) {
    throw new ApiError(400, "Incorrect username or password");
  }
  const isMatched = await bcrypt.compare(password, exsistingUser.password);
  if (!isMatched) {
    throw new ApiError(400, "Invalid Password");
  }

  const existingSession = await Session.findOne({ userId: exsistingUser._id });
  if (existingSession) {
    await Session.deleteOne({ userId: exsistingUser._id });
  }

  await Session.create({ userId: exsistingUser._id });

  const token = jwt.sign(
    {
      username,
      email: exsistingUser.email,
      id: exsistingUser._id,
      role: exsistingUser.role,
      isLoggedIn: true,
      firstname: exsistingUser.firstname,
      lastname: exsistingUser.lastname,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
  );
  exsistingUser.isLoggedIn = true;
  await exsistingUser.save();
  res.status(200).json({
    id: exsistingUser._id,
    token: token,
    role:exsistingUser.role,
    apiResponse: new ApiResponse(200, "Logged In", token),
  });
});

export const logout = asyncHandler(async (req, res) => {
  try {
    const { userId } = req;
    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json(new ApiResponse(200, "You are logout"));
  } catch (err) {
    throw new ApiError(400, err.message);
  }
});
