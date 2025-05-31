"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_designs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      design_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      design_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho order_id để tối ưu khi join
    await queryInterface.addIndex("order_designs", ["order_id"], {
      name: "idx_designs_order",
    });

    // Tạo index cho design_type để tối ưu filter
    await queryInterface.addIndex("order_designs", ["design_type"], {
      name: "idx_designs_type",
    });

    // Tạo index cho is_active để tối ưu filter
    await queryInterface.addIndex("order_designs", ["is_active"], {
      name: "idx_designs_active",
    });

    // Tạo index cho created_at để tối ưu khi sắp xếp theo thời gian
    await queryInterface.addIndex("order_designs", ["created_at"], {
      name: "idx_designs_created",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order_designs");
  },
};
