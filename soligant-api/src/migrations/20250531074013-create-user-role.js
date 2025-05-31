"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_roles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    });

    // Tạo index để tối ưu truy vấn người dùng theo vai trò
    await queryInterface.addIndex("user_roles", ["user_id"], {
      name: "idx_user_roles_user",
    });

    // Tạo index để tối ưu truy vấn vai trò theo người dùng
    await queryInterface.addIndex("user_roles", ["role_id"], {
      name: "idx_user_roles_role",
    });

    // Tạo unique index cho cặp user_id và role_id
    await queryInterface.addIndex("user_roles", ["user_id", "role_id"], {
      name: "idx_user_roles_unique",
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_roles");
  },
};
