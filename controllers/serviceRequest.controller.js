import { ServiceRequest } from "../models/serviceRequest.model.js";
import { Service } from "../models/service.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// 1. Submit Service Request
export const createServiceRequest = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const {
    service: serviceId,
    requirements,
    budget,
    deadline,
  } = req.body;

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
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      "Service request submitted successfully",
      request
    )
  );
});

// 2. Get My Requests (Customer)
export const getMyRequests = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const requests = await ServiceRequest.find({
    customer: customerId,
  })
    .populate("service", "title category price")
    .populate("provider", "firstname lastname email");

  return res.status(200).json(
    new ApiResponse(200, "Requests fetched successfully", requests)
  );
});

// 3. Get Provider Requests
export const getProviderRequests = asyncHandler(async (req, res) => {
  const providerId = req.user._id;

  const requests = await ServiceRequest.find({
    provider: providerId,
  })
    .populate("customer", "firstname lastname email")
    .populate("service", "title category");

  return res.status(200).json(
    new ApiResponse(200, "Provider requests fetched", requests)
  );
});

// 4. Update Request Status
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const providerId = req.user._id;
  const { requestId } = req.params;
  const { status } = req.body;

  const request = await ServiceRequest.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (request.provider.toString() !== providerId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  request.status = status;

  await request.save();

  return res.status(200).json(
    new ApiResponse(200, "Status updated successfully", request)
  );
});

