import User from "../models/user.model.js";
import { Service } from "../models/service.model.js";
import { ServiceRequest } from "../models/serviceRequest.model.js";

 // CUSTOMER DASHBOARD
export const customerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const activeRequests = await ServiceRequest.find({
      customer: userId,
      status: { $in: ["Pending", "Accepted", "In Progress"] },
    }).populate("service provider");

    const completedProjects = await ServiceRequest.find({
      customer: userId,
      status: "Delivered",
    }).populate("service provider");

    const user = await User.findById(userId).select("-password");

    res.json({
      user,
      activeRequests,
      completedProjects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error loading customer dashboard",
      error: error.message,
    });
  }
};


 // PROVIDER DASHBOARD
export const providerDashboard = async (req, res) => {
  try {
    const providerId = req.user._id;

    const activeProjects = await ServiceRequest.find({
      provider: providerId,
      status: { $in: ["Accepted", "In Progress"] },
    }).populate("service customer");

    const pendingRequests = await ServiceRequest.find({
      provider: providerId,
      status: "Pending",
    }).populate("service customer");

    const earningsData = await ServiceRequest.aggregate([
      {
        $match: {
          provider: providerId,
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$budget" },
          totalProjects: { $sum: 1 },
        },
      },
    ]);

    const earnings = earningsData[0] || {
      totalEarnings: 0,
      totalProjects: 0,
    };

    res.json({
      activeProjects,
      pendingRequests,
      earnings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error loading provider dashboard",
      error: error.message,
    });
  }
};


 // ADMIN DASHBOARD
export const adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({
      role: "customer",
    });
    const totalProviders = await User.countDocuments({
      role: "serviceProvider",
    });

    const totalServices = await Service.countDocuments();

    const totalProjects = await ServiceRequest.countDocuments();

    const completedProjects = await ServiceRequest.countDocuments({
      status: "Delivered",
    });

    res.json({
      users: {
        total: totalUsers,
        customers: totalCustomers,
        providers: totalProviders,
      },
      services: {
        total: totalServices,
      },
      projects: {
        total: totalProjects,
        completed: completedProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error loading admin dashboard",
      error: error.message,
    });
  }
};