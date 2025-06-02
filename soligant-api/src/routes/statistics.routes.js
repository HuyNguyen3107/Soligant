const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statistics.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Tất cả routes cần xác thực
router.use(authenticateJWT);

// Revenue statistics
router.get(
  "/revenue",
  checkPermission("statistics.view"),
  statisticsController.getRevenueStatistics
);

// Collection statistics
router.get(
  "/collections",
  checkPermission("statistics.view"),
  statisticsController.getCollectionStatistics
);

// Top products statistics
router.get(
  "/products/top",
  checkPermission("statistics.view"),
  statisticsController.getTopProductsStatistics
);

// Employee statistics
router.get(
  "/employees",
  checkPermission("statistics.view"),
  statisticsController.getEmployeeStatistics
);

// Update employee statistics
router.post(
  "/employees",
  checkPermission("statistics.manage"),
  statisticsController.updateEmployeeStatistics
);

// Recalculate employee statistics
router.post(
  "/employees/recalculate",
  checkPermission("statistics.manage"),
  statisticsController.recalculateEmployeeStatistics
);

module.exports = router;
