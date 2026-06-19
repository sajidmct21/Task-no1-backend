import express from "express";

import {
  createServiceRequest,
  getMyRequests,
  getProviderRequests,
  getRequestDetails,
  updateRequestStatus,
} from "../controllers/serviceRequest.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();


// CUSTOMER ROUTES
// Create a service request
router.post("/", isAuthenticated, createServiceRequest);

// Get logged-in customer's requests
router.get("/my", isAuthenticated, getMyRequests);


// PROVIDER ROUTES
// Get provider's incoming requests
router.get("/provider", isAuthenticated, getProviderRequests);



// COMMON ROUTES
// Get single request details
router.get("/:id", isAuthenticated, getRequestDetails);

// Update request status (provider only)
router.patch("/:id/status", isAuthenticated, updateRequestStatus);


export default router;