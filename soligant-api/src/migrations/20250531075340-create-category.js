"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      display_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
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

    // Tạo index cho name (unique)
    await queryInterface.addIndex("categories", ["name"], {
      name: "idx_categories_name",
      unique: true,
    });

    // Tạo index cho is_active để tối ưu filter
    await queryInterface.addIndex("categories", ["is_active"], {
      name: "idx_categories_active",
    });

    // Tạo index cho sort_order để tối ưu khi sắp xếp
    await queryInterface.addIndex("categories", ["sort_order"], {
      name: "idx_categories_sort",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("categories");
  },
};
