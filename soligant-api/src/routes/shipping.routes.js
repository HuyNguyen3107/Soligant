const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shipping.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Routes cần xác thực (admin API)
router.get(
  "/",
  authenticateJWT,
  checkPermission("orders.view"),
  shippingController.getShippingOrders
);

router.get(
  "/:id",
  authenticateJWT,
  checkPermission("orders.view"),
  shippingController.getShippingOrderById
);

router.post(
  "/",
  authenticateJWT,
  checkPermission("orders.update"),
  shippingController.createShippingOrder
);

router.put(
  "/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  shippingController.updateShippingOrder
);

router.put(
  "/:id/status",
  authenticateJWT,
  checkPermission("orders.update"),
  shippingController.updateShippingStatus
);

router.post(
  "/viettel-post/orders/:order_id",
  authenticateJWT,
  checkPermission("orders.update"),
  shippingController.createViettelPostOrder
);

router.get(
  "/viettel-post/status/:id",
  authenticateJWT,
  checkPermission("orders.view"),
  shippingController.checkViettelPostStatus
);

router.post(
  "/:id/cancel",
  authenticateJWT,
  checkPermission("orders.update"),
  shippingController.cancelShippingOrder
);

module.exports = router;
