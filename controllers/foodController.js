const foodModel = require("../models/foodModel.js");

const createFoodController = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      restaurant,
      category,
      rating,
      isAvailable,
      ingredients,
    } = req.body;

    if (!title || !price || !restaurant || !category) {
      return res.status(400).send({
        message: "Please provide title, price, restaurant and category",
      });
    }

    const food = await foodModel.create({
      title,
      description,
      price,
      imageUrl,
      restaurant,
      category,
      rating,
      isAvailable,
      ingredients,
    });

    return res.status(201).send({
      success: true,
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in create food api",
      error,
    });
  }
};

const getAllFoodController = async (req, res) => {
  try {
    const filter = {};
    if (req.query.restaurant) {
      filter.restaurant = req.query.restaurant;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const foods = await foodModel
      .find(filter)
      .populate("restaurant", "title address")
      .populate("category", "title");
    return res.status(200).send({
      success: true,
      message: "Foods fetched successfully",
      total: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get all food api",
      error,
    });
  }
};

const getSingleFoodController = async (req, res) => {
  try {
    const food = await foodModel
      .findById(req.params.id)
      .populate("restaurant", "title address")
      .populate("category", "title");
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Food fetched successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get single food api",
      error,
    });
  }
};

const getFoodByRestaurantController = async (req, res) => {
  try {
    const foods = await foodModel
      .find({ restaurant: req.params.restaurantId })
      .populate("category", "title");
    return res.status(200).send({
      success: true,
      message: "Foods fetched by restaurant successfully",
      total: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get food by restaurant api",
      error,
    });
  }
};

const updateFoodController = async (req, res) => {
  try {
    const food = await foodModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Food updated successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update food api",
      error,
    });
  }
};

const deleteFoodController = async (req, res) => {
  try {
    const food = await foodModel.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in delete food api",
      error,
    });
  }
};

module.exports = {
  createFoodController,
  getAllFoodController,
  getSingleFoodController,
  getFoodByRestaurantController,
  updateFoodController,
  deleteFoodController,
};
