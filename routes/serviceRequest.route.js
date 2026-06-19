import express from "express";
import {
  createServiceRequest,
  getMyRequests,
  getProviderRequests,
  updateRequestStatus,
} from "../controllers/serviceRequest.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, createServiceRequest);

router.get("/my-requests", isAuthenticated, getMyRequests);

router.get(
  "/provider-requests",
  isAuthenticated,
  getProviderRequests
);

router.patch(
  "/:requestId/status",
  isAuthenticated,
  updateRequestStatus
);

export default router;