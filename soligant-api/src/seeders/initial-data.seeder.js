"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo roles
    const roles = [
      { id: uuidv4(), name: "admin", created_at: new Date() },
      { id: uuidv4(), name: "manager", created_at: new Date() },
      { id: uuidv4(), name: "employee", created_at: new Date() },
    ];

    await queryInterface.bulkInsert("roles", roles);

    // Tạo permissions
    const permissions = [
      // User permissions
      { id: uuidv4(), name: "users.view", created_at: new Date() },
      { id: uuidv4(), name: "users.create", created_at: new Date() },
      { id: uuidv4(), name: "users.update", created_at: new Date() },
      { id: uuidv4(), name: "users.delete", created_at: new Date() },

      // Category permissions
      { id: uuidv4(), name: "categories.view", created_at: new Date() },
      { id: uuidv4(), name: "categories.create", created_at: new Date() },
      { id: uuidv4(), name: "categories.update", created_at: new Date() },
      { id: uuidv4(), name: "categories.delete", created_at: new Date() },

      // Collection permissions
      { id: uuidv4(), name: "collections.view", created_at: new Date() },
      { id: uuidv4(), name: "collections.create", created_at: new Date() },
      { id: uuidv4(), name: "collections.update", created_at: new Date() },
      { id: uuidv4(), name: "collections.delete", created_at: new Date() },

      // Product permissions
      { id: uuidv4(), name: "products.view", created_at: new Date() },
      { id: uuidv4(), name: "products.create", created_at: new Date() },
      { id: uuidv4(), name: "products.update", created_at: new Date() },
      { id: uuidv4(), name: "products.delete", created_at: new Date() },

      // Order permissions
      { id: uuidv4(), name: "orders.view", created_at: new Date() },
      { id: uuidv4(), name: "orders.create", created_at: new Date() },
      { id: uuidv4(), name: "orders.update", created_at: new Date() },
      { id: uuidv4(), name: "orders.delete", created_at: new Date() },
      { id: uuidv4(), name: "orders.assign", created_at: new Date() },

      // Inventory permissions
      { id: uuidv4(), name: "inventory.view", created_at: new Date() },
      { id: uuidv4(), name: "inventory.update", created_at: new Date() },

      // Statistics permissions
      { id: uuidv4(), name: "statistics.view", created_at: new Date() },
    ];

    await queryInterface.bulkInsert("permissions", permissions);

    // Tạo admin user
    const password_hash = await bcrypt.hash("admin123", 10);
    const adminUser = {
      id: uuidv4(),
      email: "admin@soligant.com",
      password_hash,
      full_name: "Admin User",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await queryInterface.bulkInsert("users", [adminUser]);

    // Gán role admin cho admin user
    const adminRole = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkInsert("user_roles", [
      {
        id: uuidv4(),
        user_id: adminUser.id,
        role_id: adminRole[0].id,
      },
    ]);

    // Gán tất cả permissions cho role admin
    const adminPermissions = permissions.map((permission) => ({
      id: uuidv4(),
      role_id: adminRole[0].id,
      permission_id: permission.id,
    }));

    await queryInterface.bulkInsert("role_permissions", adminPermissions);

    // Gán một số permissions cho role manager
    const managerRole = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'manager'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const managerPermissionNames = [
      "users.view",
      "categories.view",
      "collections.view",
      "collections.update",
      "products.view",
      "products.update",
      "orders.view",
      "orders.update",
      "orders.assign",
      "inventory.view",
      "inventory.update",
      "statistics.view",
    ];

    const managerPermissions = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE name IN ('${managerPermissionNames.join(
        "','"
      )}')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const managerRolePermissions = managerPermissions.map((permission) => ({
      id: uuidv4(),
      role_id: managerRole[0].id,
      permission_id: permission.id,
    }));

    await queryInterface.bulkInsert("role_permissions", managerRolePermissions);

    // Gán permissions cho role employee
    const employeeRole = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'employee'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const employeePermissionNames = [
      "categories.view",
      "collections.view",
      "products.view",
      "orders.view",
      "orders.update",
      "inventory.view",
    ];

    const employeePermissions = await queryInterface.sequelize.query(
      `SELECT id FROM permissions WHERE name IN ('${employeePermissionNames.join(
        "','"
      )}')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const employeeRolePermissions = employeePermissions.map((permission) => ({
      id: uuidv4(),
      role_id: employeeRole[0].id,
      permission_id: permission.id,
    }));

    await queryInterface.bulkInsert(
      "role_permissions",
      employeeRolePermissions
    );
  },

  async down(queryInterface, Sequelize) {
    // Xóa data theo thứ tự ngược lại
    await queryInterface.bulkDelete("role_permissions", null, {});
    await queryInterface.bulkDelete("user_roles", null, {});
    await queryInterface.bulkDelete("permissions", null, {});
    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
