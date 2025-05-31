"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItemVariant extends Model {
    static associate(models) {
      // Quan hệ với OrderItem
      this.belongsTo(models.OrderItem, {
        foreignKey: "order_item_id",
        as: "orderItem",
      });
    }
  }

  OrderItemVariant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_item_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "order_items",
          key: "id",
        },
      },
      variant_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      variant_value: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price_adjustment: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "OrderItemVariant",
      tableName: "order_item_variants",
      underscored: true,
      timestamps: false, // Không có timestamps trong schema
    }
  );

  return OrderItemVariant;
};
