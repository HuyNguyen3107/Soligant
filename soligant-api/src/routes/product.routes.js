const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const productVariantController = require("../controllers/product-variant.controller");
const productImageController = require("../controllers/product-image.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Routes không cần xác thực (public API)
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.get(
  "/:product_id/variants",
  productVariantController.getProductVariants
);
router.get("/:product_id/images", productImageController.getProductImages);

// Routes cần xác thực (admin API)
// Product routes
router.post(
  "/",
  authenticateJWT,
  checkPermission("products.create"),
  productController.createProduct
);
router.put(
  "/:id",
  authenticateJWT,
  checkPermission("products.update"),
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticateJWT,
  checkPermission("products.update"),
  productController.deleteProduct
);

// Product Variant routes
router.post(
  "/:product_id/variants",
  authenticateJWT,
  checkPermission("products.update"),
  productVariantController.createVariant
);
router.put(
  "/variants/:id",
  authenticateJWT,
  checkPermission("products.update"),
  productVariantController.updateVariant
);
router.delete(
  "/variants/:id",
  authenticateJWT,
  checkPermission("products.update"),
  productVariantController.deleteVariant
);
router.get(
  "/variants/:id",
  authenticateJWT,
  checkPermission("products.view"),
  productVariantController.getVariantById
);

// Product Image routes
router.post(
  "/:product_id/images",
  authenticateJWT,
  checkPermission("products.update"),
  productImageController.addProductImage
);
router.put(
  "/images/:id",
  authenticateJWT,
  checkPermission("products.update"),
  productImageController.updateProductImage
);
router.delete(
  "/images/:id",
  authenticateJWT,
  checkPermission("products.update"),
  productImageController.deleteProductImage
);

module.exports = router;
