const {
  Order,
  OrderItem,
  Product,
  User,
  Collection,
  EmployeeStatistic,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

/**
 * Lấy thống kê doanh thu theo thời gian
 */
exports.getRevenueStatistics = async (req, res, next) => {
  try {
    const { period = "month", start_date, end_date } = req.query;

    // Xác định khoảng thời gian
    let startDateTime, endDateTime;

    if (start_date && end_date) {
      startDateTime = new Date(start_date);
      endDateTime = new Date(end_date);
    } else {
      // Mặc định lấy 12 tháng gần nhất
      endDateTime = new Date();
      startDateTime = new Date();
      startDateTime.setFullYear(endDateTime.getFullYear() - 1);
    }

    // Xây dựng điều kiện truy vấn
    const where = {
      created_at: {
        [Op.between]: [startDateTime, endDateTime],
      },
      status: {
        [Op.in]: ["completed", "shipped"], // Chỉ tính các đơn đã hoàn thành hoặc đang giao
      },
    };

    let statistics;

    // Thống kê theo ngày, tháng hoặc năm
    if (period === "day") {
      statistics = await Order.findAll({
        attributes: [
          [
            sequelize.fn("date_trunc", "day", sequelize.col("created_at")),
            "date",
          ],
          [sequelize.fn("COUNT", sequelize.col("id")), "order_count"],
          [sequelize.fn("SUM", sequelize.col("total_amount")), "total_revenue"],
        ],
        where,
        group: [sequelize.fn("date_trunc", "day", sequelize.col("created_at"))],
        order: [
          [
            sequelize.fn("date_trunc", "day", sequelize.col("created_at")),
            "ASC",
          ],
        ],
      });
    } else if (period === "month") {
      statistics = await Order.findAll({
        attributes: [
          [
            sequelize.fn("date_trunc", "month", sequelize.col("created_at")),
            "date",
          ],
          [sequelize.fn("COUNT", sequelize.col("id")), "order_count"],
          [sequelize.fn("SUM", sequelize.col("total_amount")), "total_revenue"],
        ],
        where,
        group: [
          sequelize.fn("date_trunc", "month", sequelize.col("created_at")),
        ],
        order: [
          [
            sequelize.fn("date_trunc", "month", sequelize.col("created_at")),
            "ASC",
          ],
        ],
      });
    } else {
      statistics = await Order.findAll({
        attributes: [
          [
            sequelize.fn("date_trunc", "year", sequelize.col("created_at")),
            "date",
          ],
          [sequelize.fn("COUNT", sequelize.col("id")), "order_count"],
          [sequelize.fn("SUM", sequelize.col("total_amount")), "total_revenue"],
        ],
        where,
        group: [
          sequelize.fn("date_trunc", "year", sequelize.col("created_at")),
        ],
        order: [
          [
            sequelize.fn("date_trunc", "year", sequelize.col("created_at")),
            "ASC",
          ],
        ],
      });
    }

    // Tính tổng
    const totalRevenue = statistics.reduce(
      (sum, stat) => sum + parseFloat(stat.dataValues.total_revenue || 0),
      0
    );
    const totalOrders = statistics.reduce(
      (sum, stat) => sum + parseInt(stat.dataValues.order_count || 0),
      0
    );

    return res.json({
      period,
      start_date: startDateTime,
      end_date: endDateTime,
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      statistics: statistics.map((stat) => ({
        date: stat.dataValues.date,
        order_count: parseInt(stat.dataValues.order_count),
        total_revenue: parseFloat(stat.dataValues.total_revenue),
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thống kê theo bộ sưu tập
 */
exports.getCollectionStatistics = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    // Xác định khoảng thời gian
    let startDateTime, endDateTime;

    if (start_date && end_date) {
      startDateTime = new Date(start_date);
      endDateTime = new Date(end_date);
    } else {
      // Mặc định lấy 12 tháng gần nhất
      endDateTime = new Date();
      startDateTime = new Date();
      startDateTime.setFullYear(endDateTime.getFullYear() - 1);
    }

    // Xây dựng điều kiện truy vấn
    const where = {
      created_at: {
        [Op.between]: [startDateTime, endDateTime],
      },
      status: {
        [Op.in]: ["completed", "shipped"], // Chỉ tính các đơn đã hoàn thành hoặc đang giao
      },
    };

    // Thống kê theo bộ sưu tập
    const statistics = await Order.findAll({
      attributes: [
        "collection_id",
        [sequelize.fn("COUNT", sequelize.col("id")), "order_count"],
        [sequelize.fn("SUM", sequelize.col("total_amount")), "total_revenue"],
      ],
      where,
      include: [
        {
          model: Collection,
          as: "collection",
          attributes: ["id", "name", "display_name"],
        },
      ],
      group: ["collection_id", "collection.id"],
      order: [[sequelize.literal("total_revenue"), "DESC"]],
    });

    // Tính tổng
    const totalRevenue = statistics.reduce(
      (sum, stat) => sum + parseFloat(stat.dataValues.total_revenue || 0),
      0
    );
    const totalOrders = statistics.reduce(
      (sum, stat) => sum + parseInt(stat.dataValues.order_count || 0),
      0
    );

    return res.json({
      start_date: startDateTime,
      end_date: endDateTime,
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      statistics: statistics.map((stat) => ({
        collection_id: stat.dataValues.collection_id,
        collection_name: stat.collection.display_name,
        order_count: parseInt(stat.dataValues.order_count),
        total_revenue: parseFloat(stat.dataValues.total_revenue),
        percentage: (
          (parseFloat(stat.dataValues.total_revenue) / totalRevenue) *
          100
        ).toFixed(2),
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thống kê theo sản phẩm bán chạy
 */
exports.getTopProductsStatistics = async (req, res, next) => {
  try {
    const { start_date, end_date, limit = 10 } = req.query;

    // Xác định khoảng thời gian
    let startDateTime, endDateTime;

    if (start_date && end_date) {
      startDateTime = new Date(start_date);
      endDateTime = new Date(end_date);
    } else {
      // Mặc định lấy 12 tháng gần nhất
      endDateTime = new Date();
      startDateTime = new Date();
      startDateTime.setFullYear(endDateTime.getFullYear() - 1);
    }

    // Lấy danh sách đơn hàng đã hoàn thành hoặc đang giao trong khoảng thời gian
    const orders = await Order.findAll({
      attributes: ["id"],
      where: {
        created_at: {
          [Op.between]: [startDateTime, endDateTime],
        },
        status: {
          [Op.in]: ["completed", "shipped"],
        },
      },
    });

    const orderIds = orders.map((order) => order.id);

    if (orderIds.length === 0) {
      return res.json({
        start_date: startDateTime,
        end_date: endDateTime,
        total_quantity: 0,
        total_products: 0,
        statistics: [],
      });
    }

    // Thống kê theo sản phẩm
    const statistics = await OrderItem.findAll({
      attributes: [
        "product_id",
        "product_name",
        [sequelize.fn("SUM", sequelize.col("quantity")), "total_quantity"],
        [sequelize.fn("SUM", sequelize.col("total_price")), "total_revenue"],
      ],
      where: {
        order_id: { [Op.in]: orderIds },
      },
      group: ["product_id", "product_name"],
      order: [[sequelize.literal("total_quantity"), "DESC"]],
      limit: parseInt(limit),
    });

    // Tính tổng
    const totalQuantity = statistics.reduce(
      (sum, stat) => sum + parseInt(stat.dataValues.total_quantity || 0),
      0
    );

    return res.json({
      start_date: startDateTime,
      end_date: endDateTime,
      total_quantity: totalQuantity,
      total_products: statistics.length,
      statistics: statistics.map((stat) => ({
        product_id: stat.dataValues.product_id,
        product_name: stat.dataValues.product_name,
        total_quantity: parseInt(stat.dataValues.total_quantity),
        total_revenue: parseFloat(stat.dataValues.total_revenue),
        percentage: (
          (parseInt(stat.dataValues.total_quantity) / totalQuantity) *
          100
        ).toFixed(2),
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thống kê hiệu suất nhân viên
 */
exports.getEmployeeStatistics = async (req, res, next) => {
  try {
    const { employee_id, period_type = "month", period_value } = req.query;

    // Xây dựng điều kiện truy vấn
    const where = {};

    if (employee_id) {
      where.employee_id = employee_id;
    }

    if (period_type) {
      where.period_type = period_type;
    }

    if (period_value) {
      where.period_value = period_value;
    }

    // Lấy thống kê nhân viên
    const statistics = await EmployeeStatistic.findAll({
      where,
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [
        ["period_type", "ASC"],
        ["period_value", "DESC"],
        [sequelize.literal("total_revenue"), "DESC"],
      ],
    });

    return res.json({
      statistics: statistics.map((stat) => ({
        id: stat.id,
        employee_id: stat.employee_id,
        employee_name: stat.employee ? stat.employee.full_name : "Unknown",
        employee_email: stat.employee ? stat.employee.email : null,
        period_type: stat.period_type,
        period_value: stat.period_value,
        orders_assigned: stat.orders_assigned,
        orders_completed: stat.orders_completed,
        orders_cancelled: stat.orders_cancelled,
        completion_rate:
          stat.orders_assigned > 0
            ? ((stat.orders_completed / stat.orders_assigned) * 100).toFixed(2)
            : 0,
        total_revenue: parseFloat(stat.total_revenue),
        avg_completion_hours: parseFloat(stat.avg_completion_hours),
        calculated_at: stat.calculated_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo hoặc cập nhật thống kê nhân viên
 */
exports.updateEmployeeStatistics = async (req, res, next) => {
  try {
    const {
      employee_id,
      period_type,
      period_value,
      orders_assigned,
      orders_completed,
      orders_cancelled,
      total_revenue,
      avg_completion_hours,
    } = req.body;

    // Kiểm tra nhân viên tồn tại
    const employee = await User.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ message: "Nhân viên không tồn tại" });
    }

    // Kiểm tra period_type hợp lệ
    const validPeriodTypes = ["day", "week", "month", "quarter", "year"];
    if (!validPeriodTypes.includes(period_type)) {
      return res.status(400).json({
        message: "Loại kỳ không hợp lệ",
        validPeriodTypes,
      });
    }

    // Tìm thống kê hiện tại
    let statistic = await EmployeeStatistic.findOne({
      where: {
        employee_id,
        period_type,
        period_value,
      },
    });

    if (statistic) {
      // Cập nhật thống kê hiện tại
      await statistic.update({
        orders_assigned:
          orders_assigned !== undefined
            ? orders_assigned
            : statistic.orders_assigned,
        orders_completed:
          orders_completed !== undefined
            ? orders_completed
            : statistic.orders_completed,
        orders_cancelled:
          orders_cancelled !== undefined
            ? orders_cancelled
            : statistic.orders_cancelled,
        total_revenue:
          total_revenue !== undefined ? total_revenue : statistic.total_revenue,
        avg_completion_hours:
          avg_completion_hours !== undefined
            ? avg_completion_hours
            : statistic.avg_completion_hours,
        calculated_at: new Date(),
      });
    } else {
      // Tạo thống kê mới
      statistic = await EmployeeStatistic.create({
        employee_id,
        period_type,
        period_value,
        orders_assigned: orders_assigned || 0,
        orders_completed: orders_completed || 0,
        orders_cancelled: orders_cancelled || 0,
        total_revenue: total_revenue || 0,
        avg_completion_hours: avg_completion_hours || 0,
        calculated_at: new Date(),
      });
    }

    return res.json({
      message: statistic
        ? "Cập nhật thống kê nhân viên thành công"
        : "Tạo thống kê nhân viên thành công",
      statistic: {
        id: statistic.id,
        employee_id: statistic.employee_id,
        period_type: statistic.period_type,
        period_value: statistic.period_value,
        orders_assigned: statistic.orders_assigned,
        orders_completed: statistic.orders_completed,
        orders_cancelled: statistic.orders_cancelled,
        total_revenue: parseFloat(statistic.total_revenue),
        avg_completion_hours: parseFloat(statistic.avg_completion_hours),
        calculated_at: statistic.calculated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tính toán lại thống kê nhân viên dựa trên dữ liệu đơn hàng
 */
exports.recalculateEmployeeStatistics = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      employee_id,
      period_type = "month",
      recalculate_all = false,
    } = req.body;

    // Kiểm tra nhân viên tồn tại nếu có
    if (employee_id) {
      const employee = await User.findByPk(employee_id);
      if (!employee) {
        await transaction.rollback();
        return res.status(404).json({ message: "Nhân viên không tồn tại" });
      }
    }

    // Kiểm tra period_type hợp lệ
    const validPeriodTypes = ["day", "week", "month", "quarter", "year"];
    if (!validPeriodTypes.includes(period_type)) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Loại kỳ không hợp lệ",
        validPeriodTypes,
      });
    }

    // Xây dựng điều kiện truy vấn
    const where = {};

    if (employee_id) {
      where.assigned_employee_id = employee_id;
    } else if (!recalculate_all) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Phải chỉ định employee_id hoặc recalculate_all=true",
      });
    }

    // Tính toán số liệu theo kỳ
    let orders;
    let periodFormat;

    switch (period_type) {
      case "day":
        periodFormat = "YYYY-MM-DD";
        break;
      case "week":
        periodFormat = "YYYY-WW";
        break;
      case "month":
        periodFormat = "YYYY-MM";
        break;
      case "quarter":
        periodFormat = "YYYY-Q";
        break;
      case "year":
        periodFormat = "YYYY";
        break;
    }

    // Lấy danh sách đơn hàng đã được phân công
    orders = await Order.findAll({
      where,
      attributes: [
        "assigned_employee_id",
        [
          sequelize.fn("to_char", sequelize.col("created_at"), periodFormat),
          "period_value",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "orders_assigned"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              `CASE WHEN status = 'completed' THEN 1 ELSE NULL END`
            )
          ),
          "orders_completed",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              `CASE WHEN status = 'cancelled' THEN 1 ELSE NULL END`
            )
          ),
          "orders_cancelled",
        ],
        [sequelize.fn("SUM", sequelize.col("total_amount")), "total_revenue"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal(`
              CASE 
                WHEN completed_at IS NOT NULL 
                THEN EXTRACT(EPOCH FROM (completed_at - created_at)) / 3600 
                ELSE NULL 
              END
            `)
          ),
          "avg_completion_hours",
        ],
      ],
      group: [
        "assigned_employee_id",
        sequelize.fn("to_char", sequelize.col("created_at"), periodFormat),
      ],
    });

    // Xử lý từng nhóm thống kê
    const results = [];

    for (const orderStat of orders) {
      const employeeId = orderStat.assigned_employee_id;
      const periodValue = orderStat.dataValues.period_value;

      // Tìm thống kê hiện tại
      let statistic = await EmployeeStatistic.findOne({
        where: {
          employee_id: employeeId,
          period_type,
          period_value: periodValue,
        },
        transaction,
      });

      const newValues = {
        orders_assigned: parseInt(orderStat.dataValues.orders_assigned) || 0,
        orders_completed: parseInt(orderStat.dataValues.orders_completed) || 0,
        orders_cancelled: parseInt(orderStat.dataValues.orders_cancelled) || 0,
        total_revenue: parseFloat(orderStat.dataValues.total_revenue) || 0,
        avg_completion_hours:
          parseFloat(orderStat.dataValues.avg_completion_hours) || 0,
        calculated_at: new Date(),
      };

      if (statistic) {
        // Cập nhật thống kê hiện tại
        await statistic.update(newValues, { transaction });
      } else {
        // Tạo thống kê mới
        statistic = await EmployeeStatistic.create(
          {
            employee_id: employeeId,
            period_type,
            period_value: periodValue,
            ...newValues,
          },
          { transaction }
        );
      }

      results.push({
        employee_id: employeeId,
        period_type,
        period_value: periodValue,
        ...newValues,
      });
    }

    // Commit transaction
    await transaction.commit();

    return res.json({
      message: "Tính toán lại thống kê nhân viên thành công",
      total_records: results.length,
      statistics: results,
    });
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};
