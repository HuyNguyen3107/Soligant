"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SystemConfiguration extends Model {
    static associate(models) {
      // Không có quan hệ với các bảng khác
    }
  }

  SystemConfiguration.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      config_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      config_value: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const value = this.getDataValue("config_value");
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        },
        set(value) {
          if (typeof value === "object") {
            this.setDataValue("config_value", JSON.stringify(value));
          } else {
            this.setDataValue("config_value", value);
          }
        },
      },
      config_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "SystemConfiguration",
      tableName: "system_configurations",
      underscored: true,
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: false, // Không có trường created_at
    }
  );

  return SystemConfiguration;
};
