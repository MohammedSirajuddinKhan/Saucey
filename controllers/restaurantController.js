const restaurantModel = require("../models/restaurantModel.js");

const createRestaurantController = async (req, res) => {
  try {
    const { title, imageUrl, time, pickup, delivery, isOpen, rating, address } =
      req.body;

    if (!title || !address) {
      return res.status(400).send({
        message: "Please provide title and address",
      });
    }

    const restaurant = await restaurantModel.create({
      title,
      imageUrl,
      time,
      pickup,
      delivery,
      isOpen,
      rating,
      address,
      owner: req.userId,
    });

    return res.status(201).send({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in create restaurant api",
      error,
    });
  }
};

const getAllRestaurantController = async (req, res) => {
  try {
    const restaurants = await restaurantModel
      .find({})
      .populate("owner", "username email phone usertype");
    return res.status(200).send({
      success: true,
      message: "Restaurants fetched successfully",
      total: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get all restaurant api",
      error,
    });
  }
};

const getSingleRestaurantController = async (req, res) => {
  try {
    const restaurant = await restaurantModel
      .findById(req.params.id)
      .populate("owner", "username email phone usertype");
    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get single restaurant api",
      error,
    });
  }
};

module.exports = {
  createRestaurantController,
  getAllRestaurantController,
  getSingleRestaurantController,
};
