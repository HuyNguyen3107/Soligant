const { Order, OrderCustomization, AuditLog } = require("../models");

/**
 * Thêm tùy chỉnh cho đơn hàng
 */
exports.addOrderCustomization = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { customization_type, customization_key, customization_value } =
      req.body;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra xem đã tồn tại tùy chỉnh với type và key này chưa
    const existingCustomization = await OrderCustomization.findOne({
      where: {
        order_id,
        customization_type,
        customization_key,
      },
    });

    if (existingCustomization) {
      // Cập nhật giá trị nếu đã tồn tại
      await existingCustomization.update({ customization_value });

      // Ghi log
      if (req.user) {
        await AuditLog.create({
          user_id: req.user.id,
          action: "update_order_customization",
          resource_type: "order_customizations",
          resource_id: existingCustomization.id,
          created_at: new Date(),
        });
      }

      return res.json({
        message: "Cập nhật tùy chỉnh đơn hàng thành công",
        customization: {
          id: existingCustomization.id,
          order_id: existingCustomization.order_id,
          customization_type: existingCustomization.customization_type,
          customization_key: existingCustomization.customization_key,
          customization_value: existingCustomization.customization_value,
        },
      });
    }

    // Tạo tùy chỉnh mới nếu chưa tồn tại
    const customization = await OrderCustomization.create({
      order_id,
      customization_type,
      customization_key,
      customization_value,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "add_order_customization",
        resource_type: "order_customizations",
        resource_id: customization.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Thêm tùy chỉnh đơn hàng thành công",
      customization: {
        id: customization.id,
        order_id: customization.order_id,
        customization_type: customization.customization_type,
        customization_key: customization.customization_key,
        customization_value: customization.customization_value,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật tùy chỉnh đơn hàng
 */
exports.updateOrderCustomization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customization_value } = req.body;

    // Tìm tùy chỉnh cần cập nhật
    const customization = await OrderCustomization.findByPk(id);
    if (!customization) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tùy chỉnh đơn hàng" });
    }

    // Cập nhật giá trị
    await customization.update({ customization_value });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_order_customization",
        resource_type: "order_customizations",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật tùy chỉnh đơn hàng thành công",
      customization: {
        id: customization.id,
        order_id: customization.order_id,
        customization_type: customization.customization_type,
        customization_key: customization.customization_key,
        customization_value: customization.customization_value,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa tùy chỉnh đơn hàng
 */
exports.removeOrderCustomization = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm tùy chỉnh cần xóa
    const customization = await OrderCustomization.findByPk(id);
    if (!customization) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tùy chỉnh đơn hàng" });
    }

    // Xóa tùy chỉnh
    await customization.destroy();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "remove_order_customization",
        resource_type: "order_customizations",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa tùy chỉnh đơn hàng thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách tùy chỉnh đơn hàng
 */
exports.getOrderCustomizations = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { customization_type } = req.query;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Xây dựng điều kiện tìm kiếm
    const where = { order_id };

    if (customization_type) {
      where.customization_type = customization_type;
    }

    // Lấy danh sách tùy chỉnh
    const customizations = await OrderCustomization.findAll({
      where,
      order: [
        ["customization_type", "ASC"],
        ["customization_key", "ASC"],
      ],
    });

    return res.json({
      customizations: customizations.map((customization) => ({
        id: customization.id,
        order_id: customization.order_id,
        customization_type: customization.customization_type,
        customization_key: customization.customization_key,
        customization_value: customization.customization_value,
      })),
    });
  } catch (error) {
    next(error);
  }
};
