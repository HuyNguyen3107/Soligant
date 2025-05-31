"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_customizations", {
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
      customization_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customization_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      customization_value: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    // Tạo index cho order_id để tối ưu khi join
    await queryInterface.addIndex("order_customizations", ["order_id"], {
      name: "idx_customizations_order",
    });

    // Tạo index cho customization_type để tối ưu filter
    await queryInterface.addIndex(
      "order_customizations",
      ["customization_type"],
      {
        name: "idx_customizations_type",
      }
    );

    // Tạo unique index cho cặp order_id, customization_type, customization_key
    await queryInterface.addIndex(
      "order_customizations",
      ["order_id", "customization_type", "customization_key"],
      {
        name: "idx_customizations_unique",
        unique: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order_customizations");
  },
};
