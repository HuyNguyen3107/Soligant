const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const inventoryHistoryController = require("../controllers/inventory-history.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Routes cần xác thực (admin API)
// Inventory routes
router.get(
  "/",
  authenticateJWT,
  checkPermission("products.view"),
  inventoryController.getInventory
);

router.get(
  "/low-stock",
  authenticateJWT,
  checkPermission("products.view"),
  inventoryController.getLowStockItems
);

router.get(
  "/out-of-stock",
  authenticateJWT,
  checkPermission("products.view"),
  inventoryController.getOutOfStockItems
);

router.get(
  "/:id",
  authenticateJWT,
  checkPermission("products.view"),
  inventoryController.getInventoryById
);

router.post(
  "/",
  authenticateJWT,
  checkPermission("products.update"),
  inventoryController.updateInventory
);

router.put(
  "/:id",
  authenticateJWT,
  checkPermission("products.update"),
  inventoryController.updateInventoryById
);

router.post("/check", inventoryController.checkInventoryAvailability);

router.post(
  "/reserve",
  authenticateJWT,
  checkPermission("orders.update"),
  inventoryController.reserveInventory
);

router.post(
  "/complete",
  authenticateJWT,
  checkPermission("orders.update"),
  inventoryController.completeInventory
);

router.post(
  "/cancel",
  authenticateJWT,
  checkPermission("orders.update"),
  inventoryController.cancelReservation
);

// Inventory History routes
router.get(
  "/history/all",
  authenticateJWT,
  checkPermission("products.view"),
  inventoryHistoryController.getAllInventoryHistory
);

router.get(
  "/:inventory_id/history",
  authenticateJWT,
  checkPermission("products.view"),
  inventoryHistoryController.getInventoryHistory
);

router.post(
  "/history",
  authenticateJWT,
  checkPermission("products.update"),
  inventoryHistoryController.addInventoryHistory
);

module.exports = router;
