"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("system_configurations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      config_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      config_value: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      config_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho config_key (unique)
    await queryInterface.addIndex("system_configurations", ["config_key"], {
      name: "idx_sys_config_key",
      unique: true,
    });

    // Tạo index cho config_type để tối ưu filter
    await queryInterface.addIndex("system_configurations", ["config_type"], {
      name: "idx_sys_config_type",
    });

    // Tạo index cho is_active để tối ưu filter
    await queryInterface.addIndex("system_configurations", ["is_active"], {
      name: "idx_sys_config_active",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("system_configurations");
  },
};
