import express from "express";

import { login, logout, register } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// Signup
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", isAuthenticated, logout);
export default router;
