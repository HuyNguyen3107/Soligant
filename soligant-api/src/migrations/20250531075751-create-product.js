"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      collection_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "collections",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      display_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      base_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      is_customizable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_required: {
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
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho collection_id để tối ưu khi join
    await queryInterface.addIndex("products", ["collection_id"], {
      name: "idx_products_collection",
    });

    // Tạo index cho product_type để tối ưu filter
    await queryInterface.addIndex("products", ["product_type"], {
      name: "idx_products_type",
    });

    // Tạo index cho is_active để tối ưu filter
    await queryInterface.addIndex("products", ["is_active"], {
      name: "idx_products_active",
    });

    // Tạo index cho is_required để tối ưu filter
    await queryInterface.addIndex("products", ["is_required"], {
      name: "idx_products_required",
    });

    // Tạo index cho sort_order để tối ưu khi sắp xếp
    await queryInterface.addIndex("products", ["sort_order"], {
      name: "idx_products_sort",
    });

    // Tạo index cho name để tối ưu tìm kiếm
    await queryInterface.addIndex("products", ["name"], {
      name: "idx_products_name",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  },
};
