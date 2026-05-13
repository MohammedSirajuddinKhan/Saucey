const categoryModel = require("../models/categoryModel.js");

const createCategoryController = async (req, res) => {
  try {
    const { title, imageUrl, restaurant } = req.body;

    if (!title || !restaurant) {
      return res.status(400).send({
        message: "Please provide title and restaurant",
      });
    }

    const category = await categoryModel.create({
      title,
      imageUrl,
      restaurant,
    });

    return res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in create category api",
      error,
    });
  }
};

const getAllCategoryController = async (req, res) => {
  try {
    const filter = {};
    if (req.query.restaurant) {
      filter.restaurant = req.query.restaurant;
    }

    const categories = await categoryModel
      .find(filter)
      .populate("restaurant", "title address imageUrl");
    return res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      total: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get all category api",
      error,
    });
  }
};

const getSingleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel
      .findById(req.params.id)
      .populate("restaurant", "title address imageUrl");
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get single category api",
      error,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update category api",
      error,
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in delete category api",
      error,
    });
  }
};

module.exports = {
  createCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
