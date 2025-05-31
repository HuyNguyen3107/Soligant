"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Quan hệ với Collection
      this.belongsTo(models.Collection, {
        foreignKey: "collection_id",
        as: "collection",
      });

      // Quan hệ với User (assigned employee)
      this.belongsTo(models.User, {
        foreignKey: "assigned_employee_id",
        as: "assignedEmployee",
      });

      // Quan hệ với OrderItem
      this.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "items",
      });

      // Quan hệ với OrderCustomization
      this.hasMany(models.OrderCustomization, {
        foreignKey: "order_id",
        as: "customizations",
      });

      // Quan hệ với OrderImage
      this.hasMany(models.OrderImage, {
        foreignKey: "order_id",
        as: "images",
      });

      // Quan hệ với OrderDesign
      this.hasMany(models.OrderDesign, {
        foreignKey: "order_id",
        as: "designs",
      });

      // Quan hệ với ShippingOrder
      this.hasMany(models.ShippingOrder, {
        foreignKey: "order_id",
        as: "shippingOrders",
      });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      // Người đặt mua
      customer_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      customer_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      customer_facebook: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      customer_instagram: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      // Người nhận
      recipient_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      recipient_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      recipient_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // Thời gian & Phương thức giao hàng
      delivery_method: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      desired_delivery_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      shipping_payer: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // Thông tin đơn hàng
      collection_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "collections",
          key: "id",
        },
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "pending_payment",
      },
      is_urgent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      subtotal_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // Thông tin bổ sung
      has_pet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      card_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      special_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Quản lý đơn hàng
      assigned_employee_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      finalized_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Order;
};
