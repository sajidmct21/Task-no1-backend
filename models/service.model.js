import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Graphic Design",
        "Content Writing",
        "Digital Marketing",
      ],
    },

    price: {
      type: Number,
      required: true,
    },

    deliveryTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Service = mongoose.model("Service", serviceSchema);
