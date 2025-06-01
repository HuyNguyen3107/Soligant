/**
 * Middleware xử lý lỗi chung
 */
exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Lỗi Sequelize
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Lỗi validation dữ liệu",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      message: "Dữ liệu đã tồn tại",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      message: "Lỗi khóa ngoại",
      error: "Dữ liệu tham chiếu không tồn tại",
    });
  }

  // Lỗi JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Token không hợp lệ",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token đã hết hạn",
    });
  }

  // Lỗi custom
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Lỗi chung
  return res.status(500).json({
    message: "Lỗi máy chủ nội bộ",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

/**
 * Helper function tạo lỗi custom
 */
exports.createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
