const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    foods: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        title: String,
        price: Number,
      },
    ],
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
    address: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Out for delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    paymentType: {
      type: String,
      enum: ["COD", "Card"],
      default: "COD",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("order", orderSchema);
