import express from "express";
import {
  customerDashboard,
  providerDashboard,
  adminDashboard,
} from "../controllers/dashboard.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/customer", protect, customerDashboard);

router.get("/provider", protect, providerDashboard);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  adminDashboard
);

export default router;