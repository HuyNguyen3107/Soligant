const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
} = require("./src/models");

async function createAdmin() {
  try {
    console.log("🚀 Bắt đầu tạo tài khoản admin...");

    // 1. Tạo roles
    console.log("📝 Tạo roles...");
    const adminRole = await Role.findOrCreate({
      where: { name: "admin" },
      defaults: {
        id: uuidv4(),
        name: "admin",
        created_at: new Date(),
      },
    });

    const managerRole = await Role.findOrCreate({
      where: { name: "manager" },
      defaults: {
        id: uuidv4(),
        name: "manager",
        created_at: new Date(),
      },
    });

    const employeeRole = await Role.findOrCreate({
      where: { name: "employee" },
      defaults: {
        id: uuidv4(),
        name: "employee",
        created_at: new Date(),
      },
    });

    console.log("✅ Roles đã được tạo");

    // 2. Tạo permissions
    console.log("📝 Tạo permissions...");
    const permissions = [
      // User permissions
      "users.view",
      "users.create",
      "users.update",
      "users.delete",

      // Category permissions
      "categories.view",
      "categories.create",
      "categories.update",
      "categories.delete",

      // Collection permissions
      "collections.view",
      "collections.create",
      "collections.update",
      "collections.delete",

      // Product permissions
      "products.view",
      "products.create",
      "products.update",
      "products.delete",

      // Order permissions
      "orders.view",
      "orders.create",
      "orders.update",
      "orders.delete",
      "orders.assign",

      // Inventory permissions
      "inventory.view",
      "inventory.update",

      // Statistics permissions
      "statistics.view",
    ];

    const createdPermissions = [];
    for (const permName of permissions) {
      const [permission] = await Permission.findOrCreate({
        where: { name: permName },
        defaults: {
          id: uuidv4(),
          name: permName,
          created_at: new Date(),
        },
      });
      createdPermissions.push(permission);
    }

    console.log("✅ Permissions đã được tạo");

    // 3. Tạo admin user
    console.log("📝 Tạo admin user...");
    const password_hash = await bcrypt.hash("admin123", 10);

    const [adminUser] = await User.findOrCreate({
      where: { email: "admin@soligant.com" },
      defaults: {
        id: uuidv4(),
        email: "admin@soligant.com",
        password_hash,
        full_name: "Admin User",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    console.log("✅ Admin user đã được tạo");

    // 4. Gán role admin cho user
    console.log("📝 Gán role admin cho user...");
    await UserRole.findOrCreate({
      where: {
        user_id: adminUser.id,
        role_id: adminRole[0].id,
      },
      defaults: {
        id: uuidv4(),
        user_id: adminUser.id,
        role_id: adminRole[0].id,
      },
    });

    console.log("✅ Role đã được gán cho user");

    // 5. Gán tất cả permissions cho role admin
    console.log("📝 Gán permissions cho role admin...");
    for (const permission of createdPermissions) {
      await RolePermission.findOrCreate({
        where: {
          role_id: adminRole[0].id,
          permission_id: permission.id,
        },
        defaults: {
          id: uuidv4(),
          role_id: adminRole[0].id,
          permission_id: permission.id,
        },
      });
    }

    console.log("✅ Permissions đã được gán cho role admin");

    console.log("\n🎉 Tạo tài khoản admin thành công!");
    console.log("📧 Email: admin@soligant.com");
    console.log("🔐 Password: admin123");
    console.log("\nBạn có thể đăng nhập với thông tin trên.");
  } catch (error) {
    console.error("❌ Lỗi khi tạo admin:", error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
