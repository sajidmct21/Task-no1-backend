import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    requirements: {
      type: String,
      required: [true, "Requirements are required"],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: 0,
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "In Progress",
        "Completed",
        "Delivered",
        "Rejected",
      ],
      default: "Pending",
    },

    reviewSubmitted: {
      type: Boolean,
      default: false,
    },

    acceptedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceRequest = mongoose.model(
  "ServiceRequest",
  serviceRequestSchema
);