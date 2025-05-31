"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_images", {
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
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      uploaded_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho product_id để tối ưu join
    await queryInterface.addIndex("product_images", ["product_id"], {
      name: "idx_images_product",
    });

    // Tạo index cho variant_id để tối ưu join
    await queryInterface.addIndex("product_images", ["variant_id"], {
      name: "idx_images_variant",
    });

    // Tạo index cho is_primary để tối ưu filter
    await queryInterface.addIndex("product_images", ["is_primary"], {
      name: "idx_images_primary",
    });

    // Tạo index cho sort_order để tối ưu khi sắp xếp
    await queryInterface.addIndex("product_images", ["sort_order"], {
      name: "idx_images_sort",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_images");
  },
};
