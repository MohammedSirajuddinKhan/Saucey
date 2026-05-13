const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const vendorOrAdminMiddleware = require("../middlewares/vendorOrAdminMiddleware");
const {
  createRestaurantController,
  getAllRestaurantController,
  getSingleRestaurantController,
} = require("../controllers/restaurantController");

const router = express.Router();

router.post(
  "/createRestaurant",
  authMiddleware,
  vendorOrAdminMiddleware,
  createRestaurantController,
);
router.get("/getAllRestaurant", getAllRestaurantController);
router.get("/getRestaurant/:id", getSingleRestaurantController);

module.exports = router;
