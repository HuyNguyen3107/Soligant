const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  authenticateJWT,
  checkPermission,
} = require("../middlewares/auth.middleware");

// Tất cả routes đều yêu cầu xác thực
router.use(authenticateJWT);

// Lấy danh sách nhân viên
router.get("/", checkPermission("users.view"), userController.getUsers);

// Lấy thông tin một nhân viên
router.get("/:id", checkPermission("users.view"), userController.getUserById);

// Tạo nhân viên mới
router.post("/", checkPermission("users.create"), userController.createUser);

// Cập nhật thông tin nhân viên
router.put("/:id", checkPermission("users.update"), userController.updateUser);

// Đổi mật khẩu nhân viên
router.put(
  "/:id/change-password",
  checkPermission("users.update"),
  userController.changePassword
);

module.exports = router;
