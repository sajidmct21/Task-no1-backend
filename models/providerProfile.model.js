import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
        default: [],
      },
    ],

    experience: {
      type: Number,
      default: 0,
    },

    pricing: {
      type: Number,
      default: 0,
    },

    portfolio: {
      type: [portfolioSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const ProviderProfile = mongoose.model(
  "ProviderProfile",
  providerProfileSchema,
);
