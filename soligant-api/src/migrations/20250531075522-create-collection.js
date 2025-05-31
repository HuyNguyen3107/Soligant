"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("collections", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      display_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      preview_image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
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

    // Tạo index cho category_id để tối ưu khi join
    await queryInterface.addIndex("collections", ["category_id"], {
      name: "idx_collections_category",
    });

    // Tạo unique index cho category_id và name (đảm bảo mỗi danh mục không có collection trùng tên)
    await queryInterface.addIndex("collections", ["category_id", "name"], {
      name: "idx_collections_category_name",
      unique: true,
    });

    // Tạo index cho is_active để tối ưu filter
    await queryInterface.addIndex("collections", ["is_active"], {
      name: "idx_collections_active",
    });

    // Tạo index cho sort_order để tối ưu khi sắp xếp
    await queryInterface.addIndex("collections", ["sort_order"], {
      name: "idx_collections_sort",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("collections");
  },
};
