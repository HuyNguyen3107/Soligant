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

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");
const permissionRoutes = require("./routes/permission.routes");
const categoryRoutes = require("./routes/category.routes");
const collectionRoutes = require("./routes/collection.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const shippingRoutes = require("./routes/shipping.routes");
const statisticsRoutes = require("./routes/statistics.routes");

// Thiết lập current user (demo)
const CURRENT_USER = "HuyNguyen3107";

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Soligant API is running",
    currentDateTime: getCurrentUTCDateTime(),
    currentUser: CURRENT_USER,
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

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

module.exports = app;
