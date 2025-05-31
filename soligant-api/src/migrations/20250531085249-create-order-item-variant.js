"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_item_variants", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      order_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "order_items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      variant_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      variant_value: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      price_adjustment: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
    });

    // Tạo index cho order_item_id để tối ưu khi join
    await queryInterface.addIndex("order_item_variants", ["order_item_id"], {
      name: "idx_order_variants_item",
    });

    // Tạo index cho variant_name để tối ưu tìm kiếm và filter
    await queryInterface.addIndex("order_item_variants", ["variant_name"], {
      name: "idx_order_variants_name",
    });

    // Tạo index cho cặp order_item_id và variant_name để tối ưu tìm kiếm
    await queryInterface.addIndex(
      "order_item_variants",
      ["order_item_id", "variant_name"],
      {
        name: "idx_order_variants_item_name",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order_item_variants");
  },
};
