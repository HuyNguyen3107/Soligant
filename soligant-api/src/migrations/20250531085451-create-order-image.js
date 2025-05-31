"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_images", {
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
      image_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      uploaded_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho order_id để tối ưu khi join
    await queryInterface.addIndex("order_images", ["order_id"], {
      name: "idx_order_images_order",
    });

    // Tạo index cho image_type để tối ưu filter
    await queryInterface.addIndex("order_images", ["image_type"], {
      name: "idx_order_images_type",
    });

    // Tạo index cho cặp order_id và image_type
    await queryInterface.addIndex("order_images", ["order_id", "image_type"], {
      name: "idx_order_images_order_type",
    });

    // Tạo index cho uploaded_at để tối ưu khi sắp xếp theo thời gian
    await queryInterface.addIndex("order_images", ["uploaded_at"], {
      name: "idx_order_images_uploaded",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order_images");
  },
};
