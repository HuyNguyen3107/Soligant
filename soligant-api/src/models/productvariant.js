"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      // Quan hệ với Product
      this.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });

      // Quan hệ với ProductImage
      this.hasMany(models.ProductImage, {
        foreignKey: "variant_id",
        as: "images",
      });

      // Quan hệ với Inventory
      this.hasMany(models.Inventory, {
        foreignKey: "variant_id",
        as: "inventories",
      });
    }
  }

  ProductVariant.init(
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
        allowNull: false,
        defaultValue: 0,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ProductVariant",
      tableName: "product_variants",
      underscored: true,
      timestamps: false, // Không có timestamps trong schema
    }
  );

  return ProductVariant;
};
