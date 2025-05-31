"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      // Quan hệ với Product
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });

      // Quan hệ với ProductVariant
      this.belongsTo(models.ProductVariant, {
        foreignKey: "variant_id",
        as: "variant",
      });
    }
  }

  Inventory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      variant_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "product_variants",
          key: "id",
        },
      },
      current_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reserved_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      min_stock_alert: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },
      last_updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Inventory",
      tableName: "inventory",
      underscored: true,
      timestamps: false, // Không có timestamps trong schema
      updatedAt: "last_updated_at",
      createdAt: false,
    }
  );

  return Inventory;
};
