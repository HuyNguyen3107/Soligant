"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderImage extends Model {
    static associate(models) {
      // Quan hệ với Order
      this.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }
  }

  OrderImage.init(
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
      image_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "OrderImage",
      tableName: "order_images",
      underscored: true,
      timestamps: true,
      createdAt: "uploaded_at",
      updatedAt: false, // Không có trường updated_at
    }
  );

  return OrderImage;
};
