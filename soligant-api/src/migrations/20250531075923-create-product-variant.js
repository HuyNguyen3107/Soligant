"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_variants", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products",
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
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });

    // Tạo index cho product_id để tối ưu khi join
    await queryInterface.addIndex("product_variants", ["product_id"], {
      name: "idx_variants_product",
    });

    // Tạo unique index cho cặp product_id, variant_name, variant_value
    await queryInterface.addIndex(
      "product_variants",
      ["product_id", "variant_name", "variant_value"],
      {
        name: "idx_variants_unique",
        unique: true,
      }
    );

    // Tạo index cho is_default để tối ưu filter
    await queryInterface.addIndex("product_variants", ["is_default"], {
      name: "idx_variants_default",
    });

    // Tạo index cho is_active để tối ưu filter
    await queryInterface.addIndex("product_variants", ["is_active"], {
      name: "idx_variants_active",
    });

    // Tạo index cho sort_order để tối ưu khi sắp xếp
    await queryInterface.addIndex("product_variants", ["sort_order"], {
      name: "idx_variants_sort",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_variants");
  },
};
