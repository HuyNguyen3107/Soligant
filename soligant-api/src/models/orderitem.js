"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // Quan hệ với Order
      this.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });

      // Quan hệ với Product
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });

      // Quan hệ với OrderItemVariant
      this.hasMany(models.OrderItemVariant, {
        foreignKey: "order_item_id",
        as: "variants",
      });
    }
  }

  OrderItem.init(
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
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      product_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      product_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false, // Không có trường updated_at
    }
  );

  return OrderItem;
};
