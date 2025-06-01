const {
  ProductImage,
  Product,
  ProductVariant,
  AuditLog,
} = require("../models");

/**
 * Thêm ảnh sản phẩm mới
 */
exports.addProductImage = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const {
      image_url,
      variant_id = null,
      is_primary = false,
      sort_order = 0,
    } = req.body;

    // Kiểm tra product tồn tại
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra variant tồn tại (nếu có)
    if (variant_id) {
      const variant = await ProductVariant.findOne({
        where: {
          id: variant_id,
          product_id,
        },
      });

      if (!variant) {
        return res.status(404).json({
          message: "Biến thể không tồn tại hoặc không thuộc về sản phẩm này",
        });
      }
    }

    // Nếu ảnh mới được đặt là ảnh chính, cần hủy is_primary của các ảnh khác trong cùng phạm vi
    if (is_primary) {
      const whereCondition = { product_id };

      // Nếu có variant_id, chỉ update các ảnh cùng variant
      if (variant_id) {
        whereCondition.variant_id = variant_id;
      } else {
        // Nếu không có variant_id, chỉ update các ảnh không thuộc variant nào
        whereCondition.variant_id = null;
      }

      await ProductImage.update(
        { is_primary: false },
        { where: whereCondition }
      );
    }

    // Tạo ảnh mới
    const image = await ProductImage.create({
      product_id,
      variant_id,
      image_url,
      is_primary,
      sort_order,
      uploaded_at: new Date(),
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "add_product_image",
        resource_type: "product_images",
        resource_id: image.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Thêm ảnh sản phẩm thành công",
      image: {
        id: image.id,
        product_id: image.product_id,
        variant_id: image.variant_id,
        image_url: image.image_url,
        is_primary: image.is_primary,
        sort_order: image.sort_order,
        uploaded_at: image.uploaded_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật ảnh sản phẩm
 */
exports.updateProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image_url, variant_id, is_primary, sort_order } = req.body;

    // Tìm ảnh cần cập nhật
    const image = await ProductImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy ảnh sản phẩm" });
    }

    // Kiểm tra variant tồn tại (nếu thay đổi)
    if (variant_id !== undefined && variant_id !== image.variant_id) {
      if (variant_id === null) {
        // Chuyển từ có variant sang không có variant là hợp lệ
      } else {
        // Kiểm tra variant mới có thuộc sản phẩm này không
        const variant = await ProductVariant.findOne({
          where: {
            id: variant_id,
            product_id: image.product_id,
          },
        });

        if (!variant) {
          return res.status(404).json({
            message: "Biến thể không tồn tại hoặc không thuộc về sản phẩm này",
          });
        }
      }
    }

    // Nếu ảnh được đặt là ảnh chính, cần hủy is_primary của các ảnh khác trong cùng phạm vi
    if (is_primary && !image.is_primary) {
      const whereCondition = {
        product_id: image.product_id,
        id: { [Op.ne]: id },
      };

      // Xác định phạm vi cập nhật dựa trên variant_id mới hoặc cũ
      const newVariantId =
        variant_id !== undefined ? variant_id : image.variant_id;

      if (newVariantId) {
        whereCondition.variant_id = newVariantId;
      } else {
        whereCondition.variant_id = null;
      }

      await ProductImage.update(
        { is_primary: false },
        { where: whereCondition }
      );
    }

    // Cập nhật thông tin
    await image.update({
      image_url: image_url || image.image_url,
      variant_id: variant_id !== undefined ? variant_id : image.variant_id,
      is_primary: is_primary !== undefined ? is_primary : image.is_primary,
      sort_order: sort_order !== undefined ? sort_order : image.sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_product_image",
        resource_type: "product_images",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật ảnh sản phẩm thành công",
      image: {
        id: image.id,
        product_id: image.product_id,
        variant_id: image.variant_id,
        image_url: image.image_url,
        is_primary: image.is_primary,
        sort_order: image.sort_order,
        uploaded_at: image.uploaded_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa ảnh sản phẩm
 */
exports.deleteProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm ảnh cần xóa
    const image = await ProductImage.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy ảnh sản phẩm" });
    }

    // Xóa ảnh
    await image.destroy();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "delete_product_image",
        resource_type: "product_images",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa ảnh sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách ảnh sản phẩm
 */
exports.getProductImages = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const { variant_id, is_primary } = req.query;

    // Kiểm tra product tồn tại
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Xây dựng điều kiện tìm kiếm
    const where = { product_id };

    if (variant_id !== undefined) {
      where.variant_id = variant_id === "null" ? null : variant_id;
    }

    if (is_primary !== undefined) {
      where.is_primary = is_primary === "true";
    }

    // Lấy danh sách ảnh
    const images = await ProductImage.findAll({
      where,
      order: [
        ["is_primary", "DESC"],
        ["sort_order", "ASC"],
      ],
    });

    return res.json({
      images: images.map((image) => ({
        id: image.id,
        product_id: image.product_id,
        variant_id: image.variant_id,
        image_url: image.image_url,
        is_primary: image.is_primary,
        sort_order: image.sort_order,
        uploaded_at: image.uploaded_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};
