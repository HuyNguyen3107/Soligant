const jwt = require("jsonwebtoken");
const { User, Role, Permission } = require("../models");
const { createError } = require("./error.middleware");

/**
 * Middleware xác thực JWT token
 */
exports.authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "Không có token xác thực"));
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(createError(401, "Token đã hết hạn"));
        }
        return next(createError(401, "Token không hợp lệ"));
      }

      // Tìm user từ token
      const user = await User.findByPk(decoded.id, {
        include: [
          {
            model: Role,
            as: "roles",
            include: [
              {
                model: Permission,
                as: "permissions",
              },
            ],
          },
        ],
      });

      if (!user) {
        return next(createError(404, "Không tìm thấy người dùng"));
      }

      if (!user.is_active) {
        return next(createError(403, "Tài khoản đã bị vô hiệu hóa"));
      }

      // Lưu thông tin user vào request
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware kiểm tra quyền hạn
 */
exports.checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // Lấy tất cả permissions từ user đã đăng nhập
    const userPermissions = [];
    req.user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        userPermissions.push(permission.name);
      });
    });

    // Kiểm tra permission
    if (userPermissions.includes(requiredPermission)) {
      next();
    } else {
      next(createError(403, "Không có quyền thực hiện thao tác này"));
    }
  };
};
