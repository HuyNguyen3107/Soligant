"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderCustomization extends Model {
    static associate(models) {
      // Quan hệ với Order
      this.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }
  }

  OrderCustomization.init(
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
      customization_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      customization_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      customization_value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderCustomization",
      tableName: "order_customizations",
      underscored: true,
      timestamps: false, // Không có timestamps trong schema
    }
  );

  return OrderCustomization;
};
