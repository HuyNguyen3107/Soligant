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

// Đăng xuất tất cả thiết bị (cần xác thực)
router.post("/logout-all", authenticateJWT, authController.logoutAll);

// Lấy thông tin user hiện tại (cần xác thực)
router.get("/me", authenticateJWT, authController.getCurrentUser);

// Debug: Lấy refresh tokens (chỉ development)
router.get("/debug/tokens", authenticateJWT, authController.getRefreshTokens);

module.exports = router;
