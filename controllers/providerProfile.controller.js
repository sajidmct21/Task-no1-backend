import { ProviderProfile } from "../models/providerProfile.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create profile
export const createProfile = asyncHandler(async (req, res) => {
 const {user, userId} = req;
//  console.log(user, userId);
 if(!user || !userId){
    throw new ApiError(404, "You are not authorized");
 }
//  if(user.role !== 'serviceProvider' || user.role !== 'admin'){
//     throw new ApiError(404, "You are not authorized");
//  }
 const existingProfile = await ProviderProfile.findOne({user:userId});
 if(existingProfile){
    throw new ApiError(400, "Profile already exist");
 }
 const {profilePicture, skills,experience,pricing, portfolio} = req.body;
 const profileData = {
  user:userId,
  profilePicture,
  skills,
  experience,
  pricing,
  portfolio
 }
  const profile = await ProviderProfile.create(profileData);
  return res.status(201).json(new ApiResponse(201, "Profile Created", profile));
})

// Get Providder profile
export const getProviderProfile= asyncHandler(async(req,res)=>{
    const {userId} = req;
  const profile = await ProviderProfile.findOne({user:userId});
  if(!profile){
    throw new ApiError(404, "Profile not found");
  }
  return res.status(200).json(new ApiResponse(200, "Profile Found", profile));
});

// Update Providder profile
export const updateProviderProfile= asyncHandler(async(req,res)=>{
    const {userId} = req;
    const profile = await ProviderProfile.findOneAndUpdate({user:userId},req.body,{new:true});
    return res.status(200).json(new ApiResponse(200, "Profile Updated", profile));
});

// Delete Providder profile
export const deleteProviderProfile= asyncHandler(async(req,res)=>{
    const {userId} = req;
    const profile = await ProviderProfile.findOneAndDelete({user:userId});
    if(!profile){
        throw new ApiError(404, "Profile not found");
    }
    return res.status(200).json(new ApiResponse(200, "Profile Deleted", profile));
});

// Add portfolio
export const addPortfolio = asyncHandler(async (req, res) => {
  const {userId} = req;

  const profile = await ProviderProfile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  profile.portfolio.push(req.body);

  await profile.save();

  res.status(201).json(
    new ApiResponse(201, "Portfolio added", profile.portfolio)
  );
});

// Get All Portfolio Items
export const getPortfolio = asyncHandler(async (req, res) => {
  const {userId} = req;

  const profile = await ProviderProfile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  res.status(200).json(
    new ApiResponse(200, "Portfolio fetched", profile.portfolio)
  );
});

// Update Portfolio Item
export const updatePortfolio = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { portfolioId } = req.params;

  const profile = await ProviderProfile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const item = profile.portfolio.id(portfolioId);

  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  Object.assign(item, req.body);

  await profile.save();

  res.status(200).json(
    new ApiResponse(200, "Portfolio updated", item)
  );
});

// Delete Portfolio Item
export const deletePortfolio = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { portfolioId } = req.params;

  const profile = await ProviderProfile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const item = profile.portfolio.id(portfolioId);

  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  item.deleteOne();

  await profile.save();

  res.status(200).json(
    new ApiResponse(200, "Portfolio deleted", null)
  );
});


