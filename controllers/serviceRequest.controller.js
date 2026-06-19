import { ServiceRequest } from "../models/serviceRequest.model.js";
import { Service } from "../models/service.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// 1. CREATE SERVICE REQUEST

export const createServiceRequest = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const { service: serviceId, requirements, budget, deadline } = req.body;

  if (!serviceId || !requirements || !budget || !deadline) {
    throw new ApiError(400, "All fields are required");
  }

  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const request = await ServiceRequest.create({
    customer: customerId,
    provider: service.provider,
    service: service._id,
    requirements,
    budget,
    deadline,
    status: "Pending",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Service request created", request));
});



// 2. GET CUSTOMER REQUESTS

export const getMyRequests = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const requests = await ServiceRequest.find({ customer: customerId })
    .populate("service", "title category price deliveryTime")
    .populate("provider", "firstname lastname email");

  return res
    .status(200)
    .json(new ApiResponse(200, "Customer requests fetched", requests));
});


// 3. GET PROVIDER REQUESTS

export const getProviderRequests = asyncHandler(async (req, res) => {
  const providerId = req.user._id;

  const requests = await ServiceRequest.find({ provider: providerId })
    .populate("service", "title category price")
    .populate("customer", "firstname lastname email");

  return res
    .status(200)
    .json(new ApiResponse(200, "Provider requests fetched", requests));
});



// 4. GET SINGLE REQUEST DETAILS

export const getRequestDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await ServiceRequest.findById(id)
    .populate("service")
    .populate("customer", "firstname lastname email")
    .populate("provider", "firstname lastname email");

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Request details fetched", request));
});



// 5. UPDATE REQUEST STATUS

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const providerId = req.user._id;
  const { id } = req.params;
  const { status } = req.body;

  const request = await ServiceRequest.findById(id);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (request.provider.toString() !== providerId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  request.status = status;

  // Auto timestamps
  if (status === "Accepted") {
    request.acceptedAt = new Date();
  }

  if (status === "Completed") {
    request.completedAt = new Date();
  }

  if (status === "Delivered") {
    request.deliveredAt = new Date();
  }

  await request.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Status updated successfully", request));
});