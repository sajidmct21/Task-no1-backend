import express from "express";

import {
  createService,
  getAllServices,
  searchServices,
  filterByCategory,
  getServiceDetails,
  updateService,
  deleteService,
  getProviderServices,
} from "../controllers/service.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();


// Public Routes
router.get("/all-services", getAllServices);
router.get("/search", searchServices);
router.get("/filter", filterByCategory);
router.get("/:id", getServiceDetails);


// Protected Routes
router.post("/create-service", isAuthenticated, createService);
router.put("/:id", isAuthenticated, updateService);
router.delete("/:id", isAuthenticated, deleteService);
router.get("/provider/my-services", isAuthenticated, getProviderServices);


export default router;