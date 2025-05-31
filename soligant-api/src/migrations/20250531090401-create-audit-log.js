"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("audit_logs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      resource_type: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      resource_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho user_id để tối ưu khi join
    await queryInterface.addIndex("audit_logs", ["user_id"], {
      name: "idx_audit_user",
    });

    // Tạo index cho action để tối ưu filter
    await queryInterface.addIndex("audit_logs", ["action"], {
      name: "idx_audit_action",
    });

    // Tạo index cho resource_type để tối ưu filter
    await queryInterface.addIndex("audit_logs", ["resource_type"], {
      name: "idx_audit_resource_type",
    });

    // Tạo index cho resource_id để tối ưu tìm kiếm
    await queryInterface.addIndex("audit_logs", ["resource_id"], {
      name: "idx_audit_resource_id",
    });

    // Tạo index cho created_at để tối ưu khi sắp xếp theo thời gian
    await queryInterface.addIndex("audit_logs", ["created_at"], {
      name: "idx_audit_created",
    });

    // Tạo index composite cho resource_type và resource_id
    await queryInterface.addIndex(
      "audit_logs",
      ["resource_type", "resource_id"],
      {
        name: "idx_audit_resource",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("audit_logs");
  },
};
