const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// Khởi tạo express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Import utility
const { getCurrentUTCDateTime } = require("./utils/date.util");

// Thiết lập current user (demo)
const CURRENT_USER = "HuyNguyen3107";

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Soligant API is running",
    currentDateTime: getCurrentUTCDateTime(),
    currentUser: CURRENT_USER,
  });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Xử lý lỗi global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Current UTC time: ${getCurrentUTCDateTime()}`);
  console.log(`Current user: ${CURRENT_USER}`);
});
