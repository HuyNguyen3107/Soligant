const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Routes không cần xác thực (public API)
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

// Routes cần xác thực (admin API)
router.post(
  "/",
  authenticateJWT,
  checkPermission("categories.create"),
  categoryController.createCategory
);
router.put(
  "/:id",
  authenticateJWT,
  checkPermission("categories.update"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authenticateJWT,
  checkPermission("categories.update"),
  categoryController.deleteCategory
);

module.exports = router;
