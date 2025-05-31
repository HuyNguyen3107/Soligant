"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shipping_orders", {
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
      shipping_provider: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      provider_order_id: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: true,
      },
      tracking_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      shipping_status: {
        type: Sequelize.STRING(50),
        defaultValue: "pending",
      },
      shipping_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      estimated_delivery: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      actual_delivery: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho order_id để tối ưu khi join
    await queryInterface.addIndex("shipping_orders", ["order_id"], {
      name: "idx_shipping_order",
    });

    // Tạo index cho provider_order_id (unique)
    await queryInterface.addIndex("shipping_orders", ["provider_order_id"], {
      name: "idx_shipping_provider_order",
      unique: true,
    });

    // Tạo index cho tracking_number để tối ưu tìm kiếm
    await queryInterface.addIndex("shipping_orders", ["tracking_number"], {
      name: "idx_shipping_tracking",
    });

    // Tạo index cho shipping_status để tối ưu filter
    await queryInterface.addIndex("shipping_orders", ["shipping_status"], {
      name: "idx_shipping_status",
    });

    // Tạo index cho estimated_delivery để tối ưu khi sắp xếp
    await queryInterface.addIndex("shipping_orders", ["estimated_delivery"], {
      name: "idx_shipping_estimated",
    });

    // Tạo index cho actual_delivery để tối ưu khi sắp xếp
    await queryInterface.addIndex("shipping_orders", ["actual_delivery"], {
      name: "idx_shipping_actual",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("shipping_orders");
  },
};
