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

    // Vô hiệu hóa refresh token cụ thể nếu có
    if (refreshToken) {
      await RefreshToken.update(
        { revoked_at: new Date() },
        { where: { token: refreshToken } }
      );
    }

    // Vô hiệu hóa tất cả refresh tokens của user (optional - để bảo mật cao hơn)
    // Uncomment nếu muốn logout tất cả devices
    // await RefreshToken.update(
    //   { revoked_at: new Date() },
    //   { where: { user_id: req.user.id, revoked_at: null } }
    // );

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

/**
 * Đăng xuất tất cả thiết bị
 */
exports.logoutAll = async (req, res, next) => {
  try {
    // Vô hiệu hóa tất cả refresh tokens của user
    await RefreshToken.update(
      { revoked_at: new Date() },
      {
        where: {
          user_id: req.user.id,
          revoked_at: null,
        },
      }
    );

    // Ghi log đăng xuất tất cả
    await AuditLog.create({
      user_id: req.user.id,
      action: "logout_all",
      created_at: new Date(),
    });

    return res.json({ message: "Đăng xuất tất cả thiết bị thành công" });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin user hiện tại
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Lấy user với roles và permissions
    const user = await User.findByPk(userId, {
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
      return next(createError(404, "User không tồn tại"));
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        roles: user.roles.map((role) => role.name),
        permissions: user.roles.flatMap((role) =>
          role.permissions.map((permission) => permission.name)
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Debug: Lấy danh sách refresh tokens (chỉ dùng trong development)
 */
exports.getRefreshTokens = async (req, res, next) => {
  try {
    // Chỉ cho phép trong development mode
    if (process.env.NODE_ENV === "production") {
      return next(
        createError(403, "Endpoint này chỉ khả dụng trong development")
      );
    }

    const tokens = await RefreshToken.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
      attributes: ["id", "token", "expires_at", "revoked_at", "created_at"],
    });

    return res.json({
      user_id: req.user.id,
      tokens: tokens.map((token) => ({
        id: token.id,
        token: token.token.substring(0, 8) + "...", // Chỉ hiện 8 ký tự đầu
        expires_at: token.expires_at,
        revoked_at: token.revoked_at,
        created_at: token.created_at,
        status: token.revoked_at
          ? "revoked"
          : token.expires_at < new Date()
          ? "expired"
          : "active",
      })),
    });
  } catch (error) {
    next(error);
  }
};
