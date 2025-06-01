const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collection.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Routes không cần xác thực (public API)
router.get("/", collectionController.getCollections);
router.get("/:id", collectionController.getCollectionById);

// Routes cần xác thực (admin API)
router.post(
  "/",
  authenticateJWT,
  checkPermission("collections.create"),
  collectionController.createCollection
);
router.put(
  "/:id",
  authenticateJWT,
  checkPermission("collections.update"),
  collectionController.updateCollection
);
router.delete(
  "/:id",
  authenticateJWT,
  checkPermission("collections.update"),
  collectionController.deleteCollection
);

module.exports = router;
