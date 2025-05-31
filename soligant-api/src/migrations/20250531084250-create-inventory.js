"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventory", {
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
      variant_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "product_variants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      current_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reserved_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      min_stock_alert: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
      },
      last_updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho product_id để tối ưu join
    await queryInterface.addIndex("inventory", ["product_id"], {
      name: "idx_inventory_product",
    });

    // Tạo index cho variant_id để tối ưu join
    await queryInterface.addIndex("inventory", ["variant_id"], {
      name: "idx_inventory_variant",
    });

    // Tạo unique index cho cặp product_id và variant_id
    await queryInterface.addIndex("inventory", ["product_id", "variant_id"], {
      name: "idx_inventory_unique",
      unique: true,
    });

    // Tạo index cho current_stock để tối ưu filter khi tìm sản phẩm hết hàng
    await queryInterface.addIndex("inventory", ["current_stock"], {
      name: "idx_inventory_stock",
    });

    // Tạo index cho last_updated_at để tối ưu khi truy vấn theo thời gian cập nhật
    await queryInterface.addIndex("inventory", ["last_updated_at"], {
      name: "idx_inventory_updated",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("inventory");
  },
};
