const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const vendorOrAdminMiddleware = require("../middlewares/vendorOrAdminMiddleware");
const {
  createFoodController,
  getAllFoodController,
  getSingleFoodController,
  getFoodByRestaurantController,
  updateFoodController,
  deleteFoodController,
} = require("../controllers/foodController");

const router = express.Router();

router.post(
  "/createFood",
  authMiddleware,
  vendorOrAdminMiddleware,
  createFoodController,
);
router.get("/getAllFood", getAllFoodController);
router.get("/getFood/:id", getSingleFoodController);
router.get("/getFoodByRestaurant/:restaurantId", getFoodByRestaurantController);
router.put("/updateFood/:id", authMiddleware, updateFoodController);
router.delete("/deleteFood/:id", authMiddleware, deleteFoodController);

module.exports = router;
