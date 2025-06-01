"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventory_history", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      inventory_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "inventory",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      action_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      previous_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      new_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      previous_reserved: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      new_reserved: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho inventory_id
    await queryInterface.addIndex("inventory_history", ["inventory_id"], {
      name: "idx_inventory_history_inventory",
    });

    // Tạo index cho user_id
    await queryInterface.addIndex("inventory_history", ["user_id"], {
      name: "idx_inventory_history_user",
    });

    // Tạo index cho action_type
    await queryInterface.addIndex("inventory_history", ["action_type"], {
      name: "idx_inventory_history_action",
    });

    // Tạo index cho created_at
    await queryInterface.addIndex("inventory_history", ["created_at"], {
      name: "idx_inventory_history_created",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("inventory_history");
  },
};
