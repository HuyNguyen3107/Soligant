"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
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
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      product_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      product_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho order_id để tối ưu khi join
    await queryInterface.addIndex("order_items", ["order_id"], {
      name: "idx_order_items_order",
    });

    // Tạo index cho product_id để tối ưu khi join
    await queryInterface.addIndex("order_items", ["product_id"], {
      name: "idx_order_items_product",
    });

    // Tạo index cho product_type để tối ưu filter
    await queryInterface.addIndex("order_items", ["product_type"], {
      name: "idx_order_items_type",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order_items");
  },
};
