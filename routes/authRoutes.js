const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//REGISTER - POST
router.post("/register", registerController);

//LOGIN - POST
router.post("/login", loginController);

//LOGOUT - POST
router.post("/logout", authMiddleware, logoutController);
module.exports = router;
