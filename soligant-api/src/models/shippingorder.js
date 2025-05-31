"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ShippingOrder extends Model {
    static associate(models) {
      // Quan hệ với Order
      this.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }
  }

  ShippingOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
      },
      shipping_provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      provider_order_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
      },
      tracking_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      shipping_status: {
        type: DataTypes.STRING(50),
        defaultValue: "pending",
      },
      shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      estimated_delivery: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      actual_delivery: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ShippingOrder",
      tableName: "shipping_orders",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ShippingOrder;
};
