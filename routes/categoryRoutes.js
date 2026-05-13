const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const vendorOrAdminMiddleware = require("../middlewares/vendorOrAdminMiddleware");
const {
  createCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/categoryController");

const router = express.Router();

router.post(
  "/createCategory",
  authMiddleware,
  vendorOrAdminMiddleware,
  createCategoryController,
);
router.get("/getAllCategory", getAllCategoryController);
router.get("/getCategory/:id", getSingleCategoryController);
router.put("/updateCategory/:id", authMiddleware, updateCategoryController);
router.delete("/deleteCategory/:id", authMiddleware, deleteCategoryController);

module.exports = router;
