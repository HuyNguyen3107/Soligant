const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const orderItemController = require("../controllers/order-item.controller");
const orderCustomizationController = require("../controllers/order-customization.controller");
const orderMediaController = require("../controllers/order-media.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Routes không cần xác thực (public API)
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);

// Routes cần xác thực (admin API)
// Order routes
router.get(
  "/",
  authenticateJWT,
  checkPermission("orders.view"),
  orderController.getOrders
);
router.put(
  "/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderController.updateOrder
);
router.put(
  "/:id/status",
  authenticateJWT,
  checkPermission("orders.update"),
  orderController.updateOrderStatus
);
router.put(
  "/:id/assign",
  authenticateJWT,
  checkPermission("orders.assign"),
  orderController.assignOrder
);

// Order Item routes
router.get(
  "/:order_id/items",
  authenticateJWT,
  checkPermission("orders.view"),
  orderItemController.getOrderItems
);
router.post(
  "/:order_id/items",
  authenticateJWT,
  checkPermission("orders.update"),
  orderItemController.addOrderItem
);
router.put(
  "/items/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderItemController.updateOrderItem
);
router.delete(
  "/items/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderItemController.removeOrderItem
);

// Order Item Variant routes
router.post(
  "/items/:order_item_id/variants",
  authenticateJWT,
  checkPermission("orders.update"),
  orderItemController.addOrderItemVariant
);
router.delete(
  "/item-variants/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderItemController.removeOrderItemVariant
);

// Order Customization routes
router.get(
  "/:order_id/customizations",
  orderCustomizationController.getOrderCustomizations
);
router.post(
  "/:order_id/customizations",
  authenticateJWT,
  checkPermission("orders.update"),
  orderCustomizationController.addOrderCustomization
);
router.put(
  "/customizations/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderCustomizationController.updateOrderCustomization
);
router.delete(
  "/customizations/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderCustomizationController.removeOrderCustomization
);

// Order Image routes
router.get("/:order_id/images", orderMediaController.getOrderImages);
router.post(
  "/:order_id/images",
  authenticateJWT,
  checkPermission("orders.update"),
  orderMediaController.addOrderImage
);
router.put(
  "/images/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderMediaController.updateOrderImage
);
router.delete(
  "/images/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderMediaController.removeOrderImage
);

// Order Design routes
router.get("/:order_id/designs", orderMediaController.getOrderDesigns);
router.post(
  "/:order_id/designs",
  authenticateJWT,
  checkPermission("orders.update"),
  orderMediaController.addOrderDesign
);
router.put(
  "/designs/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderMediaController.updateOrderDesign
);
router.delete(
  "/designs/:id",
  authenticateJWT,
  checkPermission("orders.update"),
  orderMediaController.removeOrderDesign
);

module.exports = router;
