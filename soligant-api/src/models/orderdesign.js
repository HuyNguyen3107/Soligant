"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderDesign extends Model {
    static associate(models) {
      // Quan hệ với Order
      this.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }
  }

  OrderDesign.init(
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
      design_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      design_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "OrderDesign",
      tableName: "order_designs",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false, // Không có trường updated_at
    }
  );

  return OrderDesign;
};
