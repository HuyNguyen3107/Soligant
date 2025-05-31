"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employee_statistics", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      period_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      period_value: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      orders_assigned: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      orders_completed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      orders_cancelled: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_revenue: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      avg_completion_hours: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      },
      calculated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho employee_id để tối ưu khi join
    await queryInterface.addIndex("employee_statistics", ["employee_id"], {
      name: "idx_stats_employee",
    });

    // Tạo index cho period_type để tối ưu filter
    await queryInterface.addIndex("employee_statistics", ["period_type"], {
      name: "idx_stats_period_type",
    });

    // Tạo unique index cho cặp employee_id, period_type, period_value
    await queryInterface.addIndex(
      "employee_statistics",
      ["employee_id", "period_type", "period_value"],
      {
        name: "idx_stats_unique",
        unique: true,
      }
    );

    // Tạo index cho calculated_at để tối ưu khi sắp xếp theo thời gian
    await queryInterface.addIndex("employee_statistics", ["calculated_at"], {
      name: "idx_stats_calculated",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("employee_statistics");
  },
};
