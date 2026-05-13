const orderModel = require("../models/orderModel.js");
const foodModel = require("../models/foodModel.js");

const createOrderController = async (req, res) => {
  try {
    const { foods, restaurant, address, paymentType } = req.body;

    if (
      !foods ||
      !Array.isArray(foods) ||
      foods.length === 0 ||
      !restaurant ||
      !address
    ) {
      return res.status(400).send({
        message: "Please provide foods, restaurant and address",
      });
    }

    let total = 0;
    const normalizedFoods = [];

    for (const item of foods) {
      const foodId = item.food || item._id || item.id;
      const quantity = Number(item.quantity || 1);
      const food = await foodModel.findById(foodId);

      if (!food) {
        return res.status(404).send({
          message: `Food not found for id ${foodId}`,
        });
      }

      if (food.restaurant.toString() !== restaurant.toString()) {
        return res.status(400).send({
          message: "All foods must belong to the selected restaurant",
        });
      }

      total += food.price * quantity;
      normalizedFoods.push({
        food: food._id,
        quantity,
        title: food.title,
        price: food.price,
      });
    }

    const order = await orderModel.create({
      foods: normalizedFoods,
      buyer: req.userId,
      restaurant,
      address,
      total,
      paymentType,
    });

    return res.status(201).send({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in create order api",
      error,
    });
  }
};

const updateOrderStatusController = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({
        message: "Please provide order status",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update order status api",
      error,
    });
  }
};

module.exports = {
  createOrderController,
  updateOrderStatusController,
};
