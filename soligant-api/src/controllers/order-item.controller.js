const {
  Order,
  OrderItem,
  OrderItemVariant,
  AuditLog,
  sequelize,
} = require("../models");

/**
 * Thêm sản phẩm vào đơn hàng
 */
exports.addOrderItem = async (req, res, next) => {
  // Bắt đầu transaction
  const transaction = await sequelize.transaction();

  try {
    const { order_id } = req.params;
    const {
      product_id,
      product_name,
      product_type,
      quantity = 1,
      unit_price,
      variants = [],
    } = req.body;

    // Tìm đơn hàng
    const order = await Order.findByPk(order_id);
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Tính tổng giá của item
    let item_total = unit_price * quantity;

    // Tạo order item
    const orderItem = await OrderItem.create(
      {
        order_id,
        product_id,
        product_name,
        product_type,
        quantity,
        unit_price,
        total_price: item_total,
        created_at: new Date(),
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

    // Cập nhật tổng tiền đơn hàng
    const subtotal_amount = order.subtotal_amount + item_total;
    const total_amount = subtotal_amount + order.shipping_fee;

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
        action: "add_order_item",
        resource_type: "order_items",
        resource_id: orderItem.id,
        created_at: new Date(),
      });
    }

    // Lấy thông tin order item với variants
    const createdOrderItem = await OrderItem.findByPk(orderItem.id, {
      include: [
        {
          model: OrderItemVariant,
          as: "variants",
        },
      ],
    });

    return res.status(201).json({
      message: "Thêm sản phẩm vào đơn hàng thành công",
      orderItem: {
        id: createdOrderItem.id,
        product_id: createdOrderItem.product_id,
        product_name: createdOrderItem.product_name,
        product_type: createdOrderItem.product_type,
        quantity: createdOrderItem.quantity,
        unit_price: createdOrderItem.unit_price,
        total_price: createdOrderItem.total_price,
        created_at: createdOrderItem.created_at,
        variants: createdOrderItem.variants.map((variant) => ({
          id: variant.id,
          variant_name: variant.variant_name,
          variant_value: variant.variant_value,
          price_adjustment: variant.price_adjustment,
        })),
      },
      order: {
        id: order.id,
        subtotal_amount,
        total_amount,
      },
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    next(error);
  }
};

/**
 * Cập nhật sản phẩm trong đơn hàng
 */
exports.updateOrderItem = async (req, res, next) => {
  // Bắt đầu transaction
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { product_name, quantity, unit_price } = req.body;

    // Tìm order item cần cập nhật
    const orderItem = await OrderItem.findByPk(id, {
      include: [
        {
          model: OrderItemVariant,
          as: "variants",
        },
      ],
    });

    if (!orderItem) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong đơn hàng" });
    }

    // Lưu lại giá trị cũ để tính toán sự thay đổi
    const oldTotalPrice = orderItem.total_price;

    // Tính tổng giá mới
    const newQuantity = quantity !== undefined ? quantity : orderItem.quantity;
    const newUnitPrice =
      unit_price !== undefined ? unit_price : orderItem.unit_price;

    // Tính tổng tiền cơ bản (chưa tính price_adjustment)
    let newTotalPrice = newQuantity * newUnitPrice;

    // Cộng thêm price_adjustment cho mỗi variant
    for (const variant of orderItem.variants) {
      newTotalPrice += variant.price_adjustment * newQuantity;
    }

    // Cập nhật order item
    await orderItem.update(
      {
        product_name: product_name || orderItem.product_name,
        quantity: newQuantity,
        unit_price: newUnitPrice,
        total_price: newTotalPrice,
      },
      { transaction }
    );

    // Tìm đơn hàng để cập nhật tổng tiền
    const order = await Order.findByPk(orderItem.order_id);

    // Tính lại subtotal và total của đơn hàng
    const priceDifference = newTotalPrice - oldTotalPrice;
    const newSubtotal = order.subtotal_amount + priceDifference;
    const newTotal = newSubtotal + order.shipping_fee;

    // Cập nhật đơn hàng
    await order.update(
      {
        subtotal_amount: newSubtotal,
        total_amount: newTotal,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_order_item",
        resource_type: "order_items",
        resource_id: id,
        created_at: new Date(),
      });
    }

    // Lấy thông tin order item với variants
    const updatedOrderItem = await OrderItem.findByPk(id, {
      include: [
        {
          model: OrderItemVariant,
          as: "variants",
        },
      ],
    });

    return res.json({
      message: "Cập nhật sản phẩm trong đơn hàng thành công",
      orderItem: {
        id: updatedOrderItem.id,
        product_id: updatedOrderItem.product_id,
        product_name: updatedOrderItem.product_name,
        product_type: updatedOrderItem.product_type,
        quantity: updatedOrderItem.quantity,
        unit_price: updatedOrderItem.unit_price,
        total_price: updatedOrderItem.total_price,
        variants: updatedOrderItem.variants.map((variant) => ({
          id: variant.id,
          variant_name: variant.variant_name,
          variant_value: variant.variant_value,
          price_adjustment: variant.price_adjustment,
        })),
      },
      order: {
        id: order.id,
        subtotal_amount: newSubtotal,
        total_amount: newTotal,
      },
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    next(error);
  }
};

/**
 * Xóa sản phẩm khỏi đơn hàng
 */
exports.removeOrderItem = async (req, res, next) => {
  // Bắt đầu transaction
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Tìm order item cần xóa
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong đơn hàng" });
    }

    // Lưu lại order_id và total_price để cập nhật đơn hàng sau
    const { order_id, total_price } = orderItem;

    // Xóa các variants của order item
    await OrderItemVariant.destroy({
      where: { order_item_id: id },
      transaction,
    });

    // Xóa order item
    await orderItem.destroy({ transaction });

    // Tìm đơn hàng để cập nhật tổng tiền
    const order = await Order.findByPk(order_id);

    // Tính lại subtotal và total của đơn hàng
    const newSubtotal = order.subtotal_amount - total_price;
    const newTotal = newSubtotal + order.shipping_fee;

    // Cập nhật đơn hàng
    await order.update(
      {
        subtotal_amount: newSubtotal,
        total_amount: newTotal,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "remove_order_item",
        resource_type: "order_items",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa sản phẩm khỏi đơn hàng thành công",
      order: {
        id: order.id,
        subtotal_amount: newSubtotal,
        total_amount: newTotal,
      },
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    next(error);
  }
};

/**
 * Lấy danh sách sản phẩm trong đơn hàng
 */
exports.getOrderItems = async (req, res, next) => {
  try {
    const { order_id } = req.params;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Lấy danh sách order items
    const orderItems = await OrderItem.findAll({
      where: { order_id },
      include: [
        {
          model: OrderItemVariant,
          as: "variants",
        },
      ],
      order: [["created_at", "ASC"]],
    });

    return res.json({
      orderItems: orderItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_type: item.product_type,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        created_at: item.created_at,
        variants: item.variants.map((variant) => ({
          id: variant.id,
          variant_name: variant.variant_name,
          variant_value: variant.variant_value,
          price_adjustment: variant.price_adjustment,
        })),
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Thêm biến thể cho sản phẩm trong đơn hàng
 */
exports.addOrderItemVariant = async (req, res, next) => {
  // Bắt đầu transaction
  const transaction = await sequelize.transaction();

  try {
    const { order_item_id } = req.params;
    const { variant_name, variant_value, price_adjustment = 0 } = req.body;

    // Tìm order item
    const orderItem = await OrderItem.findByPk(order_item_id);
    if (!orderItem) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong đơn hàng" });
    }

    // Kiểm tra xem variant đã tồn tại chưa
    const existingVariant = await OrderItemVariant.findOne({
      where: {
        order_item_id,
        variant_name,
        variant_value,
      },
    });

    if (existingVariant) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Biến thể này đã tồn tại cho sản phẩm trong đơn hàng",
      });
    }

    // Tạo variant mới
    const variant = await OrderItemVariant.create(
      {
        order_item_id,
        variant_name,
        variant_value,
        price_adjustment,
      },
      { transaction }
    );

    // Cập nhật total_price của order item
    const newTotalPrice =
      orderItem.total_price + price_adjustment * orderItem.quantity;

    await orderItem.update(
      {
        total_price: newTotalPrice,
      },
      { transaction }
    );

    // Tìm đơn hàng để cập nhật tổng tiền
    const order = await Order.findByPk(orderItem.order_id);

    // Tính lại subtotal và total của đơn hàng
    const priceDifference = price_adjustment * orderItem.quantity;
    const newSubtotal = order.subtotal_amount + priceDifference;
    const newTotal = newSubtotal + order.shipping_fee;

    // Cập nhật đơn hàng
    await order.update(
      {
        subtotal_amount: newSubtotal,
        total_amount: newTotal,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "add_order_item_variant",
        resource_type: "order_item_variants",
        resource_id: variant.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Thêm biến thể cho sản phẩm trong đơn hàng thành công",
      variant: {
        id: variant.id,
        order_item_id: variant.order_item_id,
        variant_name: variant.variant_name,
        variant_value: variant.variant_value,
        price_adjustment: variant.price_adjustment,
      },
      orderItem: {
        id: orderItem.id,
        total_price: newTotalPrice,
      },
      order: {
        id: order.id,
        subtotal_amount: newSubtotal,
        total_amount: newTotal,
      },
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    next(error);
  }
};

/**
 * Xóa biến thể khỏi sản phẩm trong đơn hàng
 */
exports.removeOrderItemVariant = async (req, res, next) => {
  // Bắt đầu transaction
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Tìm variant cần xóa
    const variant = await OrderItemVariant.findByPk(id);
    if (!variant) {
      await transaction.rollback();
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    }

    // Lưu lại order_item_id và price_adjustment để cập nhật sau
    const { order_item_id, price_adjustment } = variant;

    // Tìm order item
    const orderItem = await OrderItem.findByPk(order_item_id);
    if (!orderItem) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong đơn hàng" });
    }

    // Xóa variant
    await variant.destroy({ transaction });

    // Cập nhật total_price của order item
    const newTotalPrice =
      orderItem.total_price - price_adjustment * orderItem.quantity;

    await orderItem.update(
      {
        total_price: newTotalPrice,
      },
      { transaction }
    );

    // Tìm đơn hàng để cập nhật tổng tiền
    const order = await Order.findByPk(orderItem.order_id);

    // Tính lại subtotal và total của đơn hàng
    const priceDifference = price_adjustment * orderItem.quantity;
    const newSubtotal = order.subtotal_amount - priceDifference;
    const newTotal = newSubtotal + order.shipping_fee;

    // Cập nhật đơn hàng
    await order.update(
      {
        subtotal_amount: newSubtotal,
        total_amount: newTotal,
      },
      { transaction }
    );

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "remove_order_item_variant",
        resource_type: "order_item_variants",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa biến thể khỏi sản phẩm trong đơn hàng thành công",
      orderItem: {
        id: orderItem.id,
        total_price: newTotalPrice,
      },
      order: {
        id: order.id,
        subtotal_amount: newSubtotal,
        total_amount: newTotal,
      },
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    next(error);
  }
};
