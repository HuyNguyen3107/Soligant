const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permission.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Routes cần xác thực và permission admin
router.get(
  "/",
  authenticateJWT,
  checkPermission("users.view"), // Admin can view permissions
  permissionController.getPermissions
);

router.get(
  "/:id",
  authenticateJWT,
  checkPermission("users.view"),
  permissionController.getPermissionById
);

router.post(
  "/",
  authenticateJWT,
  checkPermission("users.create"), // Admin can create permissions
  permissionController.createPermission
);

router.put(
  "/:id",
  authenticateJWT,
  checkPermission("users.update"), // Admin can update permissions
  permissionController.updatePermission
);

router.delete(
  "/:id",
  authenticateJWT,
  checkPermission("users.delete"), // Admin can delete permissions
  permissionController.deletePermission
);

module.exports = router;
