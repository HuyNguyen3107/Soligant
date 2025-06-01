"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class InventoryHistory extends Model {
    static associate(models) {
      // Quan hệ với Inventory
      this.belongsTo(models.Inventory, {
        foreignKey: "inventory_id",
        as: "inventory",
      });

      // Quan hệ với User
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  InventoryHistory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      inventory_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "inventory",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      action_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      previous_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      new_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      previous_reserved: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      new_reserved: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "InventoryHistory",
      tableName: "inventory_history",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false, // Không có trường updated_at
    }
  );

  return InventoryHistory;
};
