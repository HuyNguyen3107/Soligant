const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Routes cần xác thực và permission admin
router.get(
  "/",
  authenticateJWT,
  checkPermission("users.view"), // Admin can view roles
  roleController.getRoles
);

router.get(
  "/:id",
  authenticateJWT,
  checkPermission("users.view"),
  roleController.getRoleById
);

router.post(
  "/",
  authenticateJWT,
  checkPermission("users.create"), // Admin can create roles
  roleController.createRole
);

router.put(
  "/:id",
  authenticateJWT,
  checkPermission("users.update"), // Admin can update roles
  roleController.updateRole
);

router.delete(
  "/:id",
  authenticateJWT,
  checkPermission("users.delete"), // Admin can delete roles
  roleController.deleteRole
);

module.exports = router;
