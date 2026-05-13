const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Restaurant title is required"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    foods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
      },
    ],
    time: {
      type: String,
      default: "0",
    },
    pickup: {
      type: Boolean,
      default: true,
    },
    delivery: {
      type: Boolean,
      default: true,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      required: [true, "Restaurant address is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("restaurant", restaurantSchema);
