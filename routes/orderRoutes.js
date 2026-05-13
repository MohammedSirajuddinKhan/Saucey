const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  createOrderController,
  updateOrderStatusController,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/createOrder", authMiddleware, createOrderController);
router.put(
  "/updateOrderStatus/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatusController,
);

module.exports = router;
