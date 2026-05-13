const express = require("express");
const {
  homePageController,
  restaurantPageController,
  loginPageController,
  registerPageController,
  foodPageController,
  checkoutPageController,
  profilePageController,
  ordersPageController,
  orderDetailPageController,
  adminPageController,
} = require("../controllers/webController");

const router = express.Router();

router.get("/", homePageController);
router.get("/restaurant/:id", restaurantPageController);
router.get("/food/:id", foodPageController);
router.get("/checkout/:id", checkoutPageController);
router.get("/profile", profilePageController);
router.get("/orders", ordersPageController);
router.get("/orders/:id", orderDetailPageController);
router.get("/admin", adminPageController);
router.get("/login", loginPageController);
router.get("/register", registerPageController);

module.exports = router;
