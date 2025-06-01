const { Order, OrderImage, OrderDesign, AuditLog } = require("../models");

/**
 * Thêm ảnh cho đơn hàng
 */
exports.addOrderImage = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { image_type, image_url } = req.body;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra image_type hợp lệ
    const validImageTypes = ["design", "demo", "final", "reference"];
    if (!validImageTypes.includes(image_type)) {
      return res.status(400).json({
        message: "Loại ảnh không hợp lệ",
        validImageTypes,
      });
    }

    // Tạo ảnh mới
    const image = await OrderImage.create({
      order_id,
      image_type,
      image_url,
      uploaded_at: new Date(),
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "add_order_image",
        resource_type: "order_images",
        resource_id: image.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Thêm ảnh cho đơn hàng thành công",
      image: {
        id: image.id,
        order_id: image.order_id,
        image_type: image.image_type,
        image_url: image.image_url,
        uploaded_at: image.uploaded_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật ảnh đơn hàng
 */
exports.updateOrderImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image_type, image_url } = req.body;

    // Tìm ảnh cần cập nhật
    const image = await OrderImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy ảnh đơn hàng" });
    }

    // Kiểm tra image_type hợp lệ nếu có thay đổi
    if (image_type) {
      const validImageTypes = ["design", "demo", "final", "reference"];
      if (!validImageTypes.includes(image_type)) {
        return res.status(400).json({
          message: "Loại ảnh không hợp lệ",
          validImageTypes,
        });
      }
    }

    // Cập nhật thông tin
    await image.update({
      image_type: image_type || image.image_type,
      image_url: image_url || image.image_url,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_order_image",
        resource_type: "order_images",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật ảnh đơn hàng thành công",
      image: {
        id: image.id,
        order_id: image.order_id,
        image_type: image.image_type,
        image_url: image.image_url,
        uploaded_at: image.uploaded_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa ảnh đơn hàng
 */
exports.removeOrderImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm ảnh cần xóa
    const image = await OrderImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy ảnh đơn hàng" });
    }

    // Xóa ảnh
    await image.destroy();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "remove_order_image",
        resource_type: "order_images",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa ảnh đơn hàng thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách ảnh đơn hàng
 */
exports.getOrderImages = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { image_type } = req.query;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Xây dựng điều kiện tìm kiếm
    const where = { order_id };

    if (image_type) {
      where.image_type = image_type;
    }

    // Lấy danh sách ảnh
    const images = await OrderImage.findAll({
      where,
      order: [["uploaded_at", "DESC"]],
    });

    return res.json({
      images: images.map((image) => ({
        id: image.id,
        order_id: image.order_id,
        image_type: image.image_type,
        image_url: image.image_url,
        uploaded_at: image.uploaded_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Thêm thiết kế cho đơn hàng
 */
exports.addOrderDesign = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { design_type, design_url, is_active = true } = req.body;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra design_type hợp lệ
    const validDesignTypes = ["canva", "photoshop", "sketch"];
    if (!validDesignTypes.includes(design_type)) {
      return res.status(400).json({
        message: "Loại thiết kế không hợp lệ",
        validDesignTypes,
      });
    }

    // Tạo thiết kế mới
    const design = await OrderDesign.create({
      order_id,
      design_type,
      design_url,
      is_active,
      created_at: new Date(),
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "add_order_design",
        resource_type: "order_designs",
        resource_id: design.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Thêm thiết kế cho đơn hàng thành công",
      design: {
        id: design.id,
        order_id: design.order_id,
        design_type: design.design_type,
        design_url: design.design_url,
        is_active: design.is_active,
        created_at: design.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật thiết kế đơn hàng
 */
exports.updateOrderDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { design_url, is_active } = req.body;

    // Tìm thiết kế cần cập nhật
    const design = await OrderDesign.findByPk(id);
    if (!design) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thiết kế đơn hàng" });
    }

    // Cập nhật thông tin
    await design.update({
      design_url: design_url || design.design_url,
      is_active: is_active !== undefined ? is_active : design.is_active,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_order_design",
        resource_type: "order_designs",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật thiết kế đơn hàng thành công",
      design: {
        id: design.id,
        order_id: design.order_id,
        design_type: design.design_type,
        design_url: design.design_url,
        is_active: design.is_active,
        created_at: design.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa thiết kế đơn hàng
 */
exports.removeOrderDesign = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm thiết kế cần xóa
    const design = await OrderDesign.findByPk(id);
    if (!design) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thiết kế đơn hàng" });
    }

    // Xóa thiết kế
    await design.destroy();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "remove_order_design",
        resource_type: "order_designs",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa thiết kế đơn hàng thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách thiết kế đơn hàng
 */
exports.getOrderDesigns = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const { design_type, is_active } = req.query;

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Xây dựng điều kiện tìm kiếm
    const where = { order_id };

    if (design_type) {
      where.design_type = design_type;
    }

    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    // Lấy danh sách thiết kế
    const designs = await OrderDesign.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    return res.json({
      designs: designs.map((design) => ({
        id: design.id,
        order_id: design.order_id,
        design_type: design.design_type,
        design_url: design.design_url,
        is_active: design.is_active,
        created_at: design.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};
