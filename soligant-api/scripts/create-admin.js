// scripts/create-admin.js
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { User, Role, UserRole } = require("../src/models");

async function createAdmin() {
  try {
    console.log("🔄 Đang tạo tài khoản admin...");

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({
      where: { email: "admin@soligant.com" },
    });

    if (existingAdmin) {
      console.log("✅ Tài khoản admin đã tồn tại:");
      console.log("📧 Email: admin@soligant.com");
      console.log("🔑 Password: admin123");
      return;
    }

    // Tạo mật khẩu hash
    const password_hash = await bcrypt.hash("admin123", 10);

    // Tạo user admin
    const adminUser = await User.create({
      id: uuidv4(),
      email: "admin@soligant.com",
      password_hash,
      full_name: "Administrator",
      is_active: true,
    });

    console.log("✅ Đã tạo user admin thành công!");

    // Tìm role admin
    let adminRole = await Role.findOne({ where: { name: "admin" } });

    if (!adminRole) {
      // Tạo role admin nếu chưa có
      adminRole = await Role.create({
        id: uuidv4(),
        name: "admin",
        description: "Administrator with full access",
      });
      console.log("✅ Đã tạo role admin!");
    }

    // Gán role admin cho user
    await UserRole.create({
      id: uuidv4(),
      user_id: adminUser.id,
      role_id: adminRole.id,
    });

    console.log("✅ Đã gán role admin cho user!");
    console.log("\n🎉 Tạo tài khoản admin thành công!");
    console.log("📧 Email: admin@soligant.com");
    console.log("🔑 Password: admin123");
    console.log("👤 Full Name: Administrator");
  } catch (error) {
    console.error("❌ Lỗi khi tạo admin:", error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
