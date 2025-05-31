"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("role_permissions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    // Tạo index để tối ưu truy vấn quyền theo vai trò
    await queryInterface.addIndex("role_permissions", ["role_id"], {
      name: "idx_role_permissions_role",
    });

    // Tạo index để tối ưu truy vấn vai trò theo quyền
    await queryInterface.addIndex("role_permissions", ["permission_id"], {
      name: "idx_role_permissions_permission",
    });

    // Tạo unique index cho cặp role_id và permission_id
    await queryInterface.addIndex(
      "role_permissions",
      ["role_id", "permission_id"],
      {
        name: "idx_role_permissions_unique",
        unique: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("role_permissions");
  },
};
