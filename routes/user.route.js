import express from "express";

import { login, signIn } from "../controllers/user.controller.js";

const router = express.Router();

// Signup
router.post("/sign-in", signIn);

// Login
router.post("/login", login);
export default router;
