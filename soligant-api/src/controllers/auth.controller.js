const { User, Role, Permission, AuditLog, RefreshToken } = require("../models");
const authService = require("../services/auth.service");
const { createError } = require("../middlewares/error.middleware");

/**
 * Đăng nhập
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate credentials
    const user = await authService.validateCredentials(email, password);

    // Lấy roles và permissions
    const userWithRoles = await User.findByPk(user.id, {
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

    // Tạo token
    const tokens = await authService.generateTokens(user);

    // Ghi log đăng nhập
    await AuditLog.create({
      user_id: user.id,
      action: "login",
      created_at: new Date(),
    });

    // Trả về thông tin user và token
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        roles: userWithRoles.roles.map((role) => role.name),
        permissions: userWithRoles.roles.flatMap((role) =>
          role.permissions.map((permission) => permission.name)
        ),
      },
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Refresh token
    const tokens = await authService.refreshAccessToken(refreshToken);

    return res.json({
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng xuất
 */
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(createError(400, "Refresh token là bắt buộc"));
    }

    // Vô hiệu hóa refresh token
    await RefreshToken.update(
      { revoked_at: new Date() },
      { where: { token: refreshToken } }
    );

    // Ghi log đăng xuất
    await AuditLog.create({
      user_id: req.user.id,
      action: "logout",
      created_at: new Date(),
    });

    return res.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    next(error);
  }
};
