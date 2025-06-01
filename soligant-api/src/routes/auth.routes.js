const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateJWT } = require("../middlewares/auth.middleware");

// Đăng nhập
router.post("/login", authController.login);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

// Đăng xuất (cần xác thực)
router.post("/logout", authenticateJWT, authController.logout);

module.exports = router;
