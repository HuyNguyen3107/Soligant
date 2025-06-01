const {
  Order,
  Collection,
  User,
  OrderItem,
  OrderItemVariant,
  OrderCustomization,
  OrderImage,
  OrderDesign,
  AuditLog,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/**
 * Tạo số đơn hàng duy nhất
 */
const generateOrderNumber = async () => {
  const prefix = "SL";
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const orderNumber = `${prefix}${datePart}${randomPart}`;

  // Kiểm tra xem đã tồn tại chưa
  const existingOrder = await Order.findOne({
    where: { order_number: orderNumber },
  });
  if (existingOrder) {
    return generateOrderNumber(); // Tạo lại nếu đã tồn tại
  }

  return orderNumber;
};

/**
 * Lấy danh sách đơn hàng
 */
exports.getOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      customer_name,
      customer_phone,
      recipient_name,
      recipient_phone,
      is_urgent,
      collection_id,
      assigned_employee_id,
      start_date,
      end_date,
      sort_by = "created_at",
      sort_direction = "DESC",
    } = req.query;

    const offset = (page - 1) * parseInt(limit);

    // Xây dựng điều kiện tìm kiếm
    const where = {};

    if (status) {
      where.status = status;
    }

    if (customer_name) {
      where.customer_name = { [Op.iLike]: `%${customer_name}%` };
    }

    if (customer_phone) {
      where.customer_phone = { [Op.iLike]: `%${customer_phone}%` };
    }

    if (recipient_name) {
      where.recipient_name = { [Op.iLike]: `%${recipient_name}%` };
    }

    if (recipient_phone) {
      where.recipient_phone = { [Op.iLike]: `%${recipient_phone}%` };
    }

    if (is_urgent !== undefined) {
      where.is_urgent = is_urgent === "true";
    }

    if (collection_id) {
      where.collection_id = collection_id;
    }

    if (assigned_employee_id) {
      where.assigned_employee_id = assigned_employee_id;
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
      "total_amount",
      "desired_delivery_date",
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
          model: Collection,
          as: "collection",
          attributes: ["id", "name", "display_name"],
        },
        {
          model: User,
          as: "assignedEmployee",
          attributes: ["id", "full_name", "email"],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortColumn, sortDir]],
    };

    const { count, rows } = await Order.findAndCountAll(query);

    return res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      orders: rows.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        recipient_name: order.recipient_name,
        recipient_phone: order.recipient_phone,
        recipient_address: order.recipient_address,
        delivery_method: order.delivery_method,
        desired_delivery_date: order.desired_delivery_date,
        shipping_payer: order.shipping_payer,
        status: order.status,
        is_urgent: order.is_urgent,
        total_amount: order.total_amount,
        has_pet: order.has_pet,
        created_at: order.created_at,
        updated_at: order.updated_at,
        collection: order.collection,
        assignedEmployee: order.assignedEmployee
          ? {
              id: order.assignedEmployee.id,
              full_name: order.assignedEmployee.full_name,
              email: order.assignedEmployee.email,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo đơn hàng mới
 */
exports.createOrder = async (req, res, next) => {
  // Bắt đầu transaction để đảm bảo tính nhất quán dữ liệu
  const transaction = await sequelize.transaction();

  try {
    const {
      // Thông tin khách hàng
      customer_name,
      customer_phone,
      customer_email,
      customer_facebook,
      customer_instagram,

      // Thông tin người nhận
      recipient_name,
      recipient_phone,
      recipient_address,

      // Thông tin giao hàng
      delivery_method,
      desired_delivery_date,
      shipping_payer,

      // Thông tin đơn hàng
      collection_id,
      is_urgent = false,
      shipping_fee = 0,

      // Thông tin bổ sung
      has_pet = false,
      card_message,
      special_notes,

      // Sản phẩm trong đơn hàng
      items = [],

      // Tùy chỉnh đơn hàng
      customizations = [],
    } = req.body;

    // Kiểm tra bộ sưu tập tồn tại
    const collection = await Collection.findByPk(collection_id);
    if (!collection) {
      return res.status(404).json({ message: "Bộ sưu tập không tồn tại" });
    }

    // Tạo số đơn hàng
    const order_number = await generateOrderNumber();

    // Tính tổng tiền sản phẩm
    let subtotal_amount = 0;

    // Validate items nếu có
    if (items.length === 0) {
      return res
        .status(400)
        .json({ message: "Đơn hàng phải có ít nhất một sản phẩm" });
    }

    // Tạo đơn hàng mới
    const order = await Order.create(
      {
        order_number,

        // Thông tin khách hàng
        customer_name,
        customer_phone,
        customer_email,
        customer_facebook,
        customer_instagram,

        // Thông tin người nhận
        recipient_name,
        recipient_phone,
        recipient_address,

        // Thông tin giao hàng
        delivery_method,
        desired_delivery_date: desired_delivery_date
          ? new Date(desired_delivery_date)
          : null,
        shipping_payer,

        // Thông tin đơn hàng
        collection_id,
        status: "pending_payment", // Trạng thái mặc định khi tạo
        is_urgent,
        subtotal_amount: 0, // Sẽ cập nhật sau
        shipping_fee,
        total_amount: 0, // Sẽ cập nhật sau

        // Thông tin bổ sung
        has_pet,
        card_message,
        special_notes,
      },
      { transaction }
    );

    // Tạo các mục trong đơn hàng
    for (const item of items) {
      const {
        product_id,
        product_name,
        product_type,
        quantity = 1,
        unit_price,
        variants = [],
      } = item;

      // Tính tổng giá của item
      let item_total = unit_price * quantity;

      // Tạo order item
      const orderItem = await OrderItem.create(
        {
          order_id: order.id,
          product_id,
          product_name,
          product_type,
          quantity,
          unit_price,
          total_price: item_total,
        },
        { transaction }
      );

      // Thêm variants nếu có
      for (const variant of variants) {
        const { variant_name, variant_value, price_adjustment = 0 } = variant;

        await OrderItemVariant.create(
          {
            order_item_id: orderItem.id,
            variant_name,
            variant_value,
            price_adjustment,
          },
          { transaction }
        );

        // Cập nhật tổng giá của item với price_adjustment
        item_total += price_adjustment * quantity;
      }

      // Cập nhật lại total_price sau khi tính thêm price_adjustment
      await orderItem.update({ total_price: item_total }, { transaction });

      // Cập nhật subtotal của đơn hàng
      subtotal_amount += item_total;
    }

    // Thêm các tùy chỉnh cho đơn hàng
    for (const customization of customizations) {
      const { customization_type, customization_key, customization_value } =
        customization;

      await OrderCustomization.create(
        {
          order_id: order.id,
          customization_type,
          customization_key,
          customization_value,
        },
        { transaction }
      );
    }

    // Cập nhật tổng tiền đơn hàng
    const total_amount = subtotal_amount + shipping_fee;

    await order.update(
      {
        subtotal_amount,
        total_amount,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "create_order",
        resource_type: "orders",
        resource_id: order.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        recipient_name: order.recipient_name,
        recipient_phone: order.recipient_phone,
        status: order.status,
        subtotal_amount: order.subtotal_amount,
        shipping_fee: order.shipping_fee,
        total_amount: order.total_amount,
        is_urgent: order.is_urgent,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    next(error);
  }
};

/**
 * Lấy chi tiết đơn hàng theo ID
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Collection,
          as: "collection",
        },
        {
          model: User,
          as: "assignedEmployee",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: OrderItemVariant,
              as: "variants",
            },
          ],
        },
        {
          model: OrderCustomization,
          as: "customizations",
        },
        {
          model: OrderImage,
          as: "images",
        },
        {
          model: OrderDesign,
          as: "designs",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    return res.json({
      order: {
        id: order.id,
        order_number: order.order_number,

        // Thông tin khách hàng
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_email: order.customer_email,
        customer_facebook: order.customer_facebook,
        customer_instagram: order.customer_instagram,

        // Thông tin người nhận
        recipient_name: order.recipient_name,
        recipient_phone: order.recipient_phone,
        recipient_address: order.recipient_address,

        // Thông tin giao hàng
        delivery_method: order.delivery_method,
        desired_delivery_date: order.desired_delivery_date,
        shipping_payer: order.shipping_payer,

        // Thông tin đơn hàng
        status: order.status,
        is_urgent: order.is_urgent,
        subtotal_amount: order.subtotal_amount,
        shipping_fee: order.shipping_fee,
        total_amount: order.total_amount,

        // Thông tin bổ sung
        has_pet: order.has_pet,
        card_message: order.card_message,
        special_notes: order.special_notes,

        // Thông tin thời gian
        created_at: order.created_at,
        updated_at: order.updated_at,
        finalized_at: order.finalized_at,
        completed_at: order.completed_at,

        // Quan hệ
        collection: {
          id: order.collection.id,
          name: order.collection.name,
          display_name: order.collection.display_name,
        },
        assignedEmployee: order.assignedEmployee
          ? {
              id: order.assignedEmployee.id,
              full_name: order.assignedEmployee.full_name,
              email: order.assignedEmployee.email,
            }
          : null,
        items: order.items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_type: item.product_type,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          variants: item.variants.map((variant) => ({
            id: variant.id,
            variant_name: variant.variant_name,
            variant_value: variant.variant_value,
            price_adjustment: variant.price_adjustment,
          })),
        })),
        customizations: order.customizations.map((customization) => ({
          id: customization.id,
          customization_type: customization.customization_type,
          customization_key: customization.customization_key,
          customization_value: customization.customization_value,
        })),
        images: order.images.map((image) => ({
          id: image.id,
          image_type: image.image_type,
          image_url: image.image_url,
          uploaded_at: image.uploaded_at,
        })),
        designs: order.designs.map((design) => ({
          id: design.id,
          design_type: design.design_type,
          design_url: design.design_url,
          is_active: design.is_active,
          created_at: design.created_at,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật đơn hàng
 */
exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      // Thông tin khách hàng
      customer_name,
      customer_phone,
      customer_email,
      customer_facebook,
      customer_instagram,

      // Thông tin người nhận
      recipient_name,
      recipient_phone,
      recipient_address,

      // Thông tin giao hàng
      delivery_method,
      desired_delivery_date,
      shipping_payer,

      // Thông tin đơn hàng
      status,
      is_urgent,
      shipping_fee,

      // Thông tin bổ sung
      has_pet,
      card_message,
      special_notes,

      // Thông tin quản lý
      assigned_employee_id,
    } = req.body;

    // Tìm đơn hàng cần cập nhật
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Cập nhật thông tin
    const updateData = {};

    // Thông tin khách hàng
    if (customer_name !== undefined) updateData.customer_name = customer_name;
    if (customer_phone !== undefined)
      updateData.customer_phone = customer_phone;
    if (customer_email !== undefined)
      updateData.customer_email = customer_email;
    if (customer_facebook !== undefined)
      updateData.customer_facebook = customer_facebook;
    if (customer_instagram !== undefined)
      updateData.customer_instagram = customer_instagram;

    // Thông tin người nhận
    if (recipient_name !== undefined)
      updateData.recipient_name = recipient_name;
    if (recipient_phone !== undefined)
      updateData.recipient_phone = recipient_phone;
    if (recipient_address !== undefined)
      updateData.recipient_address = recipient_address;

    // Thông tin giao hàng
    if (delivery_method !== undefined)
      updateData.delivery_method = delivery_method;
    if (desired_delivery_date !== undefined) {
      updateData.desired_delivery_date = desired_delivery_date
        ? new Date(desired_delivery_date)
        : null;
    }
    if (shipping_payer !== undefined)
      updateData.shipping_payer = shipping_payer;

    // Thông tin đơn hàng
    if (status !== undefined) updateData.status = status;
    if (is_urgent !== undefined) updateData.is_urgent = is_urgent;

    // Thông tin bổ sung
    if (has_pet !== undefined) updateData.has_pet = has_pet;
    if (card_message !== undefined) updateData.card_message = card_message;
    if (special_notes !== undefined) updateData.special_notes = special_notes;

    // Thông tin quản lý
    if (assigned_employee_id !== undefined) {
      // Kiểm tra employee tồn tại nếu có
      if (assigned_employee_id) {
        const employee = await User.findByPk(assigned_employee_id);
        if (!employee) {
          return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }
      }
      updateData.assigned_employee_id = assigned_employee_id;
    }

    // Cập nhật shipping_fee và tổng tiền nếu có thay đổi
    if (shipping_fee !== undefined) {
      updateData.shipping_fee = shipping_fee;
      updateData.total_amount = order.subtotal_amount + shipping_fee;
    }

    // Cập nhật đơn hàng
    await order.update(updateData);

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_order",
        resource_type: "orders",
        resource_id: id,
        created_at: new Date(),
      });
    }

    // Lấy thông tin đơn hàng đã cập nhật với employee (nếu có)
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: "assignedEmployee",
          attributes: ["id", "full_name", "email"],
          required: false,
        },
      ],
    });

    return res.json({
      message: "Cập nhật đơn hàng thành công",
      order: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        customer_name: updatedOrder.customer_name,
        customer_phone: updatedOrder.customer_phone,
        recipient_name: updatedOrder.recipient_name,
        recipient_phone: updatedOrder.recipient_phone,
        status: updatedOrder.status,
        is_urgent: updatedOrder.is_urgent,
        subtotal_amount: updatedOrder.subtotal_amount,
        shipping_fee: updatedOrder.shipping_fee,
        total_amount: updatedOrder.total_amount,
        updated_at: updatedOrder.updated_at,
        assignedEmployee: updatedOrder.assignedEmployee
          ? {
              id: updatedOrder.assignedEmployee.id,
              full_name: updatedOrder.assignedEmployee.full_name,
              email: updatedOrder.assignedEmployee.email,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật trạng thái đơn hàng
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = [
      "pending_payment",
      "processing",
      "shipped",
      "completed",
      "cancelled",
      "pending_design",
      "design_approved",
      "production",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ",
        validStatuses,
      });
    }

    // Tìm đơn hàng cần cập nhật
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Cập nhật trạng thái và các trường liên quan
    const updateData = { status };

    // Nếu chuyển sang trạng thái completed, cập nhật completed_at
    if (status === "completed" && !order.completed_at) {
      updateData.completed_at = new Date();
    }

    // Nếu chuyển sang trạng thái design_approved, cập nhật finalized_at
    if (status === "design_approved" && !order.finalized_at) {
      updateData.finalized_at = new Date();
    }

    // Cập nhật đơn hàng
    await order.update(updateData);

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_order_status",
        resource_type: "orders",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: {
        id: order.id,
        order_number: order.order_number,
        status: status,
        updated_at: order.updated_at,
        finalized_at: updateData.finalized_at || order.finalized_at,
        completed_at: updateData.completed_at || order.completed_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gán đơn hàng cho nhân viên
 */
exports.assignOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { employee_id } = req.body;

    // Tìm đơn hàng cần cập nhật
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra employee tồn tại
    if (employee_id) {
      const employee = await User.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({ message: "Nhân viên không tồn tại" });
      }
    }

    // Cập nhật đơn hàng
    await order.update({ assigned_employee_id: employee_id });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "assign_order",
        resource_type: "orders",
        resource_id: id,
        created_at: new Date(),
      });
    }

    // Lấy thông tin đơn hàng đã cập nhật với employee
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: "assignedEmployee",
          attributes: ["id", "full_name", "email"],
          required: false,
        },
      ],
    });

    return res.json({
      message: employee_id
        ? "Gán đơn hàng cho nhân viên thành công"
        : "Hủy gán đơn hàng thành công",
      order: {
        id: updatedOrder.id,
        order_number: updatedOrder.order_number,
        status: updatedOrder.status,
        updated_at: updatedOrder.updated_at,
        assignedEmployee: updatedOrder.assignedEmployee
          ? {
              id: updatedOrder.assignedEmployee.id,
              full_name: updatedOrder.assignedEmployee.full_name,
              email: updatedOrder.assignedEmployee.email,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};
