const { ProductVariant, Product, AuditLog } = require("../models");

/**
 * Tạo biến thể sản phẩm mới
 */
exports.createVariant = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const {
      variant_name,
      variant_value,
      price_adjustment = 0,
      is_default = false,
      is_active = true,
      sort_order = 0,
    } = req.body;

    // Kiểm tra product tồn tại
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra xem có biến thể nào đã tồn tại với cùng tên và giá trị không
    const existingVariant = await ProductVariant.findOne({
      where: {
        product_id,
        variant_name,
        variant_value,
      },
    });

    if (existingVariant) {
      return res.status(409).json({
        message:
          "Đã tồn tại biến thể với cùng tên và giá trị trong sản phẩm này",
      });
    }

    // Nếu biến thể mới được đặt là mặc định, cần hủy is_default của các biến thể khác có cùng tên
    if (is_default) {
      await ProductVariant.update(
        { is_default: false },
        {
          where: {
            product_id,
            variant_name,
            is_default: true,
          },
        }
      );
    }

    // Tạo biến thể mới
    const variant = await ProductVariant.create({
      product_id,
      variant_name,
      variant_value,
      price_adjustment,
      is_default,
      is_active,
      sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "create_product_variant",
        resource_type: "product_variants",
        resource_id: variant.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Tạo biến thể sản phẩm thành công",
      variant: {
        id: variant.id,
        product_id: variant.product_id,
        variant_name: variant.variant_name,
        variant_value: variant.variant_value,
        price_adjustment: variant.price_adjustment,
        is_default: variant.is_default,
        is_active: variant.is_active,
        sort_order: variant.sort_order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật biến thể sản phẩm
 */
exports.updateVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      variant_name,
      variant_value,
      price_adjustment,
      is_default,
      is_active,
      sort_order,
    } = req.body;

    // Tìm biến thể cần cập nhật
    const variant = await ProductVariant.findByPk(id);
    if (!variant) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy biến thể sản phẩm" });
    }

    // Nếu thay đổi tên hoặc giá trị, kiểm tra trùng lặp
    if (
      (variant_name && variant_name !== variant.variant_name) ||
      (variant_value && variant_value !== variant.variant_value)
    ) {
      const checkName = variant_name || variant.variant_name;
      const checkValue = variant_value || variant.variant_value;

      const existingVariant = await ProductVariant.findOne({
        where: {
          product_id: variant.product_id,
          variant_name: checkName,
          variant_value: checkValue,
          id: { [Op.ne]: id },
        },
      });

      if (existingVariant) {
        return res.status(409).json({
          message:
            "Đã tồn tại biến thể với cùng tên và giá trị trong sản phẩm này",
        });
      }
    }

    // Nếu biến thể được đặt là mặc định, cần hủy is_default của các biến thể khác có cùng tên
    if (is_default && !variant.is_default) {
      const variantName = variant_name || variant.variant_name;

      await ProductVariant.update(
        { is_default: false },
        {
          where: {
            product_id: variant.product_id,
            variant_name: variantName,
            is_default: true,
            id: { [Op.ne]: id },
          },
        }
      );
    }

    // Cập nhật thông tin
    await variant.update({
      variant_name: variant_name || variant.variant_name,
      variant_value: variant_value || variant.variant_value,
      price_adjustment:
        price_adjustment !== undefined
          ? price_adjustment
          : variant.price_adjustment,
      is_default: is_default !== undefined ? is_default : variant.is_default,
      is_active: is_active !== undefined ? is_active : variant.is_active,
      sort_order: sort_order !== undefined ? sort_order : variant.sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_product_variant",
        resource_type: "product_variants",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật biến thể sản phẩm thành công",
      variant: {
        id: variant.id,
        product_id: variant.product_id,
        variant_name: variant.variant_name,
        variant_value: variant.variant_value,
        price_adjustment: variant.price_adjustment,
        is_default: variant.is_default,
        is_active: variant.is_active,
        sort_order: variant.sort_order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa biến thể sản phẩm
 */
exports.deleteVariant = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm biến thể cần xóa
    const variant = await ProductVariant.findByPk(id);
    if (!variant) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy biến thể sản phẩm" });
    }

    // Xóa biến thể
    await variant.destroy();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "delete_product_variant",
        resource_type: "product_variants",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa biến thể sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách biến thể sản phẩm
 */
exports.getProductVariants = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const { variant_name, is_active } = req.query;

    // Xây dựng điều kiện tìm kiếm
    const where = { product_id };

    if (variant_name) {
      where.variant_name = variant_name;
    }

    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    // Lấy danh sách biến thể
    const variants = await ProductVariant.findAll({
      where,
      order: [
        ["variant_name", "ASC"],
        ["sort_order", "ASC"],
      ],
    });

    return res.json({
      variants: variants.map((variant) => ({
        id: variant.id,
        product_id: variant.product_id,
        variant_name: variant.variant_name,
        variant_value: variant.variant_value,
        price_adjustment: variant.price_adjustment,
        is_default: variant.is_default,
        is_active: variant.is_active,
        sort_order: variant.sort_order,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết biến thể sản phẩm theo ID
 */
exports.getVariantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const variant = await ProductVariant.findByPk(id, {
      include: [{ model: Product, as: "product" }],
    });

    if (!variant) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy biến thể sản phẩm" });
    }

    return res.json({
      variant: {
        id: variant.id,
        variant_name: variant.variant_name,
        variant_value: variant.variant_value,
        price_adjustment: variant.price_adjustment,
        is_default: variant.is_default,
        is_active: variant.is_active,
        sort_order: variant.sort_order,
        product: {
          id: variant.product.id,
          name: variant.product.name,
          display_name: variant.product.display_name,
          product_type: variant.product.product_type,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
