"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmployeeStatistic extends Model {
    static associate(models) {
      // Quan hệ với User (employee)
      this.belongsTo(models.User, {
        foreignKey: "employee_id",
        as: "employee",
      });
    }
  }

  EmployeeStatistic.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employee_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      period_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      period_value: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      orders_assigned: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      orders_completed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      orders_cancelled: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_revenue: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      avg_completion_hours: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
      },
      calculated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "EmployeeStatistic",
      tableName: "employee_statistics",
      underscored: true,
      timestamps: false, // Không có timestamps trong schema
      updatedAt: "calculated_at",
      createdAt: false,
    }
  );

  return EmployeeStatistic;
};
