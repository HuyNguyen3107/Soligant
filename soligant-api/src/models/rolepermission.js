"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      // Không cần định nghĩa associate vì đã định nghĩa trong model Role và Permission
    }
  }

  RolePermission.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "permissions",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
      underscored: true,
      timestamps: false, // Không có timestamps
    }
  );

  return RolePermission;
};
