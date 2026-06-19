import { Service } from "../models/service.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// 1-CREATE SERVICE

export const createService = asyncHandler(async (req, res) => {
    const {userId}= req
  const provider = userId;

  const { title, description, category, price, deliveryTime } = req.body;

  if (!title || !description || !category || !price || !deliveryTime) {
    throw new ApiError(400, "All fields are required");
  }

  const service = await Service.create({
    provider,
    title,
    description,
    category,
    price,
    deliveryTime,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Service created", service));
});



//  2-GET ALL SERVICES

export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().populate("provider", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, "All services fetched", services));
});


//3- SEARCH SERVICES

export const searchServices = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const services = await Service.find({
    title: { $regex: query, $options: "i" },
  }).populate("provider", "firstname lastname role email");

  return res
    .status(200)
    .json(new ApiResponse(200, "Search results", services));
});



// 4- FILTER BY CATEGORY

export const filterByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const services = await Service.find({ category }).populate(
    "provider",
    "firstname lastname role mail"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Filtered services", services));
});



// 5. SERVICE DETAILS

export const getServiceDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id).populate(
    "provider",
    "firstname lastname role mail"
  );

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Service details", service));
});



// 6. UPDATE SERVICE

export const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  // only owner can update
  if (service.provider.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  const updatedService = await Service.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Service updated", updatedService));
});



// 7. DELETE SERVICE

export const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  if (service.provider.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  await Service.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Service deleted", null));
});



// 8. GET PROVIDER SERVICES

export const getProviderServices = asyncHandler(async (req, res) => {
  const providerId = req.user._id;

  const services = await Service.find({ provider: providerId });

  return res
    .status(200)
    .json(new ApiResponse(200, "Provider services", services));
});