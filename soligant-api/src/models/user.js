"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Quan hệ nhiều-nhiều với Role thông qua UserRole
      this.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: "user_id",
        otherKey: "role_id",
        as: "roles",
      });

      // Quan hệ với RefreshToken
      this.hasMany(models.RefreshToken, {
        foreignKey: "user_id",
        as: "refreshTokens",
      });

      // Quan hệ với PasswordReset
      this.hasMany(models.PasswordReset, {
        foreignKey: "user_id",
        as: "passwordResets",
      });

      // Quan hệ với Order (assigned employee)
      this.hasMany(models.Order, {
        foreignKey: "assigned_employee_id",
        as: "assignedOrders",
      });

      // Quan hệ với EmployeeStatistic
      this.hasMany(models.EmployeeStatistic, {
        foreignKey: "employee_id",
        as: "statistics",
      });

      // Quan hệ với AuditLog
      this.hasMany(models.AuditLog, {
        foreignKey: "user_id",
        as: "auditLogs",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
