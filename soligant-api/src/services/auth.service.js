const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, RefreshToken } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { createError } = require("../middlewares/error.middleware");
const { Op } = require("sequelize");

/**
 * Tạo access token và refresh token
 */
exports.generateTokens = async (user) => {
  // Tạo access token
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );

  // Tạo refresh token
  const refreshToken = uuidv4();

  // Lưu refresh token vào database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Hết hạn sau 30 ngày

  await RefreshToken.create({
    user_id: user.id,
    token: refreshToken,
    expires_at: expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
};

/**
 * Kiểm tra thông tin đăng nhập
 */
exports.validateCredentials = async (email, password) => {
  // Tìm user theo email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw createError(401, "Email hoặc mật khẩu không đúng");
  }

  // Kiểm tra mật khẩu
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw createError(401, "Email hoặc mật khẩu không đúng");
  }

  // Kiểm tra tài khoản có đang hoạt động không
  if (!user.is_active) {
    throw createError(403, "Tài khoản đã bị vô hiệu hóa");
  }

  return user;
};

/**
 * Refresh token
 */
exports.refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(400, "Refresh token là bắt buộc");
  }

  // Tìm refresh token trong database
  const tokenRecord = await RefreshToken.findOne({
    where: {
      token: refreshToken,
      revoked_at: null,
      expires_at: {
        [Op.gt]: new Date(), // Chưa hết hạn
      },
    },
    include: [{ model: User, as: "user" }],
  });

  if (!tokenRecord) {
    throw createError(403, "Refresh token không hợp lệ hoặc đã hết hạn");
  }

  // Kiểm tra user có active không
  if (!tokenRecord.user.is_active) {
    throw createError(403, "Tài khoản đã bị vô hiệu hóa");
  }

  // Tạo token mới
  const tokens = await this.generateTokens(tokenRecord.user);

  // Vô hiệu hóa refresh token cũ
  await tokenRecord.update({ revoked_at: new Date() });

  return tokens;
};
