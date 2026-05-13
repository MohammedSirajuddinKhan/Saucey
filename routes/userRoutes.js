const express = require("express");
const {
  getUserController,
  updateUserController,
  resetPasswordController,
  deleteAccountController,
  deleteProfileController,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//routes
//get user
router.get("/getUser", authMiddleware, getUserController);

//update profile
router.put("/updateUser", authMiddleware, updateUserController);

//reset password
router.post("/resetPassword", authMiddleware, resetPasswordController);

//delete current account
router.delete("/deleteAccount", authMiddleware, deleteAccountController);

// delete user
router.delete("/deleteUser/:id", authMiddleware, deleteProfileController);

module.exports = router;
