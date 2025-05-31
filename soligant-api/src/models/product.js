"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Quan hệ với Collection
      this.belongsTo(models.Collection, {
        foreignKey: "collection_id",
        as: "collection",
      });

      // Quan hệ với ProductVariant
      this.hasMany(models.ProductVariant, {
        foreignKey: "product_id",
        as: "variants",
      });

      // Quan hệ với ProductImage
      this.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "images",
      });

      // Quan hệ với OrderItem
      this.hasMany(models.OrderItem, {
        foreignKey: "product_id",
        as: "orderItems",
      });

      // Quan hệ với Inventory
      this.hasMany(models.Inventory, {
        foreignKey: "product_id",
        as: "inventories",
      });
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      collection_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "collections",
          key: "id",
        },
      },
      product_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      is_customizable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_required: {
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
      modelName: "Product",
      tableName: "products",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Product;
};
