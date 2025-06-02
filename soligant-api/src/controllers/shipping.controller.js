const {
  ShippingOrder,
  Order,
  User,
  AuditLog,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

/**
 * Lấy danh sách đơn vận chuyển
 */
exports.getShippingOrders = async (req, res, next) => {
  try {
    const {
      order_id,
      shipping_provider,
      shipping_status,
      tracking_number,
      start_date,
      end_date,
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_direction = "DESC",
    } = req.query;

    const offset = (page - 1) * parseInt(limit);

    // Xây dựng điều kiện tìm kiếm
    const where = {};

    if (order_id) {
      where.order_id = order_id;
    }

    if (shipping_provider) {
      where.shipping_provider = shipping_provider;
    }

    if (shipping_status) {
      where.shipping_status = shipping_status;
    }

    if (tracking_number) {
      where.tracking_number = { [Op.iLike]: `%${tracking_number}%` };
    }

    // Lọc theo khoảng thời gian
    if (start_date && end_date) {
      where.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      where.created_at = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.created_at = { [Op.lte]: new Date(end_date) };
    }

    // Xác định thứ tự sắp xếp
    const validSortColumns = [
      "created_at",
      "updated_at",
      "estimated_delivery",
      "actual_delivery",
    ];
    const sortColumn = validSortColumns.includes(sort_by)
      ? sort_by
      : "created_at";
    const sortDir = sort_direction.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Query cơ bản
    const query = {
      where,
      include: [
        {
          model: Order,
          as: "order",
          attributes: [
            "id",
            "order_number",
            "recipient_name",
            "recipient_phone",
            "recipient_address",
            "status",
          ],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortColumn, sortDir]],
    };

    const { count, rows } = await ShippingOrder.findAndCountAll(query);

    return res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      shippingOrders: rows.map((shipping) => ({
        id: shipping.id,
        order_id: shipping.order_id,
        shipping_provider: shipping.shipping_provider,
        provider_order_id: shipping.provider_order_id,
        tracking_number: shipping.tracking_number,
        shipping_status: shipping.shipping_status,
        shipping_cost: shipping.shipping_cost,
        estimated_delivery: shipping.estimated_delivery,
        actual_delivery: shipping.actual_delivery,
        created_at: shipping.created_at,
        updated_at: shipping.updated_at,
        order: {
          id: shipping.order.id,
          order_number: shipping.order.order_number,
          recipient_name: shipping.order.recipient_name,
          recipient_phone: shipping.order.recipient_phone,
          recipient_address: shipping.order.recipient_address,
          status: shipping.order.status,
        },
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết đơn vận chuyển theo ID
 */
exports.getShippingOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shipping = await ShippingOrder.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
          attributes: [
            "id",
            "order_number",
            "recipient_name",
            "recipient_phone",
            "recipient_address",
            "shipping_fee",
            "shipping_payer",
            "status",
            "special_notes",
          ],
        },
      ],
    });

    if (!shipping) {
      return res.status(404).json({ message: "Không tìm thấy đơn vận chuyển" });
    }

    return res.json({
      shippingOrder: {
        id: shipping.id,
        order_id: shipping.order_id,
        shipping_provider: shipping.shipping_provider,
        provider_order_id: shipping.provider_order_id,
        tracking_number: shipping.tracking_number,
        shipping_status: shipping.shipping_status,
        shipping_cost: shipping.shipping_cost,
        estimated_delivery: shipping.estimated_delivery,
        actual_delivery: shipping.actual_delivery,
        created_at: shipping.created_at,
        updated_at: shipping.updated_at,
        order: {
          id: shipping.order.id,
          order_number: shipping.order.order_number,
          recipient_name: shipping.order.recipient_name,
          recipient_phone: shipping.order.recipient_phone,
          recipient_address: shipping.order.recipient_address,
          shipping_fee: shipping.order.shipping_fee,
          shipping_payer: shipping.order.shipping_payer,
          status: shipping.order.status,
          special_notes: shipping.order.special_notes,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo đơn vận chuyển mới
 */
exports.createShippingOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      order_id,
      shipping_provider,
      provider_order_id,
      tracking_number,
      shipping_status = "pending",
      shipping_cost,
      estimated_delivery,
    } = req.body;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra xem đã có đơn vận chuyển nào cho order này chưa
    const existingShipping = await ShippingOrder.findOne({
      where: { order_id },
    });

    if (existingShipping) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Đơn hàng này đã có đơn vận chuyển",
        shipping_id: existingShipping.id,
      });
    }

    // Kiểm tra provider_order_id trùng lặp
    if (provider_order_id) {
      const duplicateOrder = await ShippingOrder.findOne({
        where: { provider_order_id },
      });

      if (duplicateOrder) {
        await transaction.rollback();
        return res.status(409).json({
          message: "Mã đơn hàng của nhà vận chuyển đã tồn tại",
          shipping_id: duplicateOrder.id,
        });
      }
    }

    // Tạo đơn vận chuyển mới
    const shipping = await ShippingOrder.create(
      {
        order_id,
        shipping_provider,
        provider_order_id,
        tracking_number,
        shipping_status,
        shipping_cost,
        estimated_delivery: estimated_delivery
          ? new Date(estimated_delivery)
          : null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction }
    );

    // Cập nhật trạng thái đơn hàng sang shipping nếu đang ở trạng thái processing
    if (order.status === "processing") {
      await order.update({ status: "shipped" }, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "create_shipping_order",
        resource_type: "shipping_orders",
        resource_id: shipping.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Tạo đơn vận chuyển thành công",
      shippingOrder: {
        id: shipping.id,
        order_id: shipping.order_id,
        shipping_provider: shipping.shipping_provider,
        provider_order_id: shipping.provider_order_id,
        tracking_number: shipping.tracking_number,
        shipping_status: shipping.shipping_status,
        shipping_cost: shipping.shipping_cost,
        estimated_delivery: shipping.estimated_delivery,
        created_at: shipping.created_at,
      },
    });
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};

/**
 * Cập nhật đơn vận chuyển
 */
exports.updateShippingOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      shipping_provider,
      provider_order_id,
      tracking_number,
      shipping_status,
      shipping_cost,
      estimated_delivery,
      actual_delivery,
    } = req.body;

    // Tìm đơn vận chuyển cần cập nhật
    const shipping = await ShippingOrder.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });

    if (!shipping) {
      await transaction.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn vận chuyển" });
    }

    // Kiểm tra provider_order_id trùng lặp nếu có thay đổi
    if (provider_order_id && provider_order_id !== shipping.provider_order_id) {
      const duplicateOrder = await ShippingOrder.findOne({
        where: {
          provider_order_id,
          id: { [Op.ne]: id },
        },
      });

      if (duplicateOrder) {
        await transaction.rollback();
        return res.status(409).json({
          message: "Mã đơn hàng của nhà vận chuyển đã tồn tại",
          shipping_id: duplicateOrder.id,
        });
      }
    }

    // Xử lý trạng thái đơn hàng dựa trên shipping_status mới
    if (shipping_status && shipping_status !== shipping.shipping_status) {
      const order = shipping.order;

      // Nếu shipping_status là 'delivered', cập nhật order status thành 'completed'
      if (shipping_status === "delivered" && order.status !== "completed") {
        await order.update(
          {
            status: "completed",
            completed_at: new Date(),
          },
          { transaction }
        );
      }

      // Nếu shipping_status là 'cancelled', cập nhật order status thành 'processing'
      if (shipping_status === "cancelled" && order.status === "shipped") {
        await order.update({ status: "processing" }, { transaction });
      }
    }

    // Cập nhật đơn vận chuyển
    const updates = {
      shipping_provider: shipping_provider || shipping.shipping_provider,
      provider_order_id:
        provider_order_id !== undefined
          ? provider_order_id
          : shipping.provider_order_id,
      tracking_number:
        tracking_number !== undefined
          ? tracking_number
          : shipping.tracking_number,
      shipping_status: shipping_status || shipping.shipping_status,
      shipping_cost:
        shipping_cost !== undefined ? shipping_cost : shipping.shipping_cost,
      estimated_delivery: estimated_delivery
        ? new Date(estimated_delivery)
        : shipping.estimated_delivery,
      actual_delivery: actual_delivery
        ? new Date(actual_delivery)
        : shipping.actual_delivery,
      updated_at: new Date(),
    };

    await shipping.update(updates, { transaction });

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_shipping_order",
        resource_type: "shipping_orders",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật đơn vận chuyển thành công",
      shippingOrder: {
        id: shipping.id,
        order_id: shipping.order_id,
        shipping_provider: updates.shipping_provider,
        provider_order_id: updates.provider_order_id,
        tracking_number: updates.tracking_number,
        shipping_status: updates.shipping_status,
        shipping_cost: updates.shipping_cost,
        estimated_delivery: updates.estimated_delivery,
        actual_delivery: updates.actual_delivery,
        updated_at: updates.updated_at,
      },
    });
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};

/**
 * Cập nhật trạng thái đơn vận chuyển
 */
exports.updateShippingStatus = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { shipping_status, actual_delivery } = req.body;

    // Kiểm tra shipping_status hợp lệ
    const validStatuses = [
      "pending",
      "processing",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "failed_delivery",
      "cancelled",
    ];

    if (!validStatuses.includes(shipping_status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Trạng thái vận chuyển không hợp lệ",
        validStatuses,
      });
    }

    // Tìm đơn vận chuyển cần cập nhật
    const shipping = await ShippingOrder.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });

    if (!shipping) {
      await transaction.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn vận chuyển" });
    }

    // Xử lý trạng thái đơn hàng dựa trên shipping_status mới
    const order = shipping.order;

    // Nếu shipping_status là 'delivered', cập nhật order status thành 'completed'
    if (shipping_status === "delivered" && order.status !== "completed") {
      await order.update(
        {
          status: "completed",
          completed_at: new Date(),
        },
        { transaction }
      );
    }

    // Nếu shipping_status là 'cancelled', cập nhật order status thành 'processing'
    if (shipping_status === "cancelled" && order.status === "shipped") {
      await order.update({ status: "processing" }, { transaction });
    }

    // Cập nhật đơn vận chuyển
    const updates = {
      shipping_status,
      actual_delivery:
        shipping_status === "delivered" && !shipping.actual_delivery
          ? actual_delivery
            ? new Date(actual_delivery)
            : new Date()
          : actual_delivery
          ? new Date(actual_delivery)
          : shipping.actual_delivery,
      updated_at: new Date(),
    };

    await shipping.update(updates, { transaction });

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_shipping_status",
        resource_type: "shipping_orders",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật trạng thái vận chuyển thành công",
      shippingOrder: {
        id: shipping.id,
        order_id: shipping.order_id,
        shipping_status: updates.shipping_status,
        actual_delivery: updates.actual_delivery,
        updated_at: updates.updated_at,
      },
    });
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};

/**
 * Tạo đơn vận chuyển với Viettel Post (giả lập)
 */
exports.createViettelPostOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { order_id } = req.params;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra xem đã có đơn vận chuyển nào cho order này chưa
    const existingShipping = await ShippingOrder.findOne({
      where: { order_id },
    });

    if (existingShipping) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Đơn hàng này đã có đơn vận chuyển",
        shipping_id: existingShipping.id,
      });
    }

    // Giả lập tạo đơn với Viettel Post API
    // Trong thực tế, phần này sẽ gọi API của Viettel Post
    const mockViettelPostResponse = {
      success: true,
      data: {
        order_number: `VP${Date.now()}`,
        tracking_number: `VP${Math.floor(1000000 + Math.random() * 9000000)}`,
        estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 ngày sau
        shipping_cost: order.shipping_fee || 30000,
      },
    };

    // Tạo đơn vận chuyển mới
    const shipping = await ShippingOrder.create(
      {
        order_id,
        shipping_provider: "viettel_post",
        provider_order_id: mockViettelPostResponse.data.order_number,
        tracking_number: mockViettelPostResponse.data.tracking_number,
        shipping_status: "pending",
        shipping_cost: mockViettelPostResponse.data.shipping_cost,
        estimated_delivery: mockViettelPostResponse.data.estimated_delivery,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction }
    );

    // Cập nhật trạng thái đơn hàng sang shipping nếu đang ở trạng thái processing
    if (order.status === "processing") {
      await order.update({ status: "shipped" }, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "create_viettel_post_order",
        resource_type: "shipping_orders",
        resource_id: shipping.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Tạo đơn vận chuyển với Viettel Post thành công",
      shippingOrder: {
        id: shipping.id,
        order_id: shipping.order_id,
        shipping_provider: shipping.shipping_provider,
        provider_order_id: shipping.provider_order_id,
        tracking_number: shipping.tracking_number,
        shipping_status: shipping.shipping_status,
        shipping_cost: shipping.shipping_cost,
        estimated_delivery: shipping.estimated_delivery,
        created_at: shipping.created_at,
      },
      viettel_post_response: mockViettelPostResponse,
    });
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};

/**
 * Kiểm tra trạng thái đơn vận chuyển với Viettel Post (giả lập)
 */
exports.checkViettelPostStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm đơn vận chuyển
    const shipping = await ShippingOrder.findByPk(id);

    if (!shipping) {
      return res.status(404).json({ message: "Không tìm thấy đơn vận chuyển" });
    }

    if (shipping.shipping_provider !== "viettel_post") {
      return res
        .status(400)
        .json({ message: "Đơn vận chuyển này không phải của Viettel Post" });
    }

    // Giả lập kiểm tra với Viettel Post API
    // Trong thực tế, phần này sẽ gọi API của Viettel Post
    const possibleStatuses = [
      "pending",
      "processing",
      "in_transit",
      "out_for_delivery",
      "delivered",
    ];
    const randomIndex = Math.floor(Math.random() * possibleStatuses.length);

    const mockViettelPostResponse = {
      success: true,
      data: {
        order_number: shipping.provider_order_id,
        tracking_number: shipping.tracking_number,
        status: possibleStatuses[randomIndex],
        status_details: `Đơn hàng đang ở trạng thái ${possibleStatuses[randomIndex]}`,
        estimated_delivery: shipping.estimated_delivery,
        actual_delivery:
          possibleStatuses[randomIndex] === "delivered" ? new Date() : null,
      },
    };

    return res.json({
      message: "Kiểm tra trạng thái đơn vận chuyển thành công",
      viettel_post_response: mockViettelPostResponse,
      current_shipping_status: shipping.shipping_status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Hủy đơn vận chuyển
 */
exports.cancelShippingOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Tìm đơn vận chuyển cần hủy
    const shipping = await ShippingOrder.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
        },
      ],
    });

    if (!shipping) {
      await transaction.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn vận chuyển" });
    }

    // Kiểm tra xem có thể hủy không
    if (["delivered", "cancelled"].includes(shipping.shipping_status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Không thể hủy đơn vận chuyển ở trạng thái ${shipping.shipping_status}`,
      });
    }

    // Giả lập hủy đơn với Viettel Post API nếu cần
    // Trong thực tế, phần này sẽ gọi API của Viettel Post nếu shipping_provider là 'viettel_post'

    // Cập nhật đơn vận chuyển
    await shipping.update(
      {
        shipping_status: "cancelled",
        updated_at: new Date(),
      },
      { transaction }
    );

    // Cập nhật trạng thái đơn hàng
    const order = shipping.order;
    if (order.status === "shipped") {
      await order.update({ status: "processing" }, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "cancel_shipping_order",
        resource_type: "shipping_orders",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Hủy đơn vận chuyển thành công",
      shippingOrder: {
        id: shipping.id,
        order_id: shipping.order_id,
        shipping_status: "cancelled",
        updated_at: new Date(),
        cancellation_reason: reason || "Không có lý do",
      },
    });
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};
