const {
  Product,
  Collection,
  ProductVariant,
  ProductImage,
  AuditLog,
} = require("../models");
const { Op } = require("sequelize");

/**
 * Lấy danh sách sản phẩm
 */
exports.getProducts = async (req, res, next) => {
  try {
    const {
      collection_id,
      product_type,
      is_active,
      is_customizable,
      is_required,
      include_variants,
      include_images,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * parseInt(limit);

    // Xây dựng điều kiện tìm kiếm
    const where = {};

    if (collection_id) {
      where.collection_id = collection_id;
    }

    if (product_type) {
      where.product_type = product_type;
    }

    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    if (is_customizable !== undefined) {
      where.is_customizable = is_customizable === "true";
    }

    if (is_required !== undefined) {
      where.is_required = is_required === "true";
    }

    // Query cơ bản
    const query = {
      where,
      include: [
        {
          model: Collection,
          as: "collection",
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [
        ["sort_order", "ASC"],
        ["name", "ASC"],
      ],
    };

    // Bao gồm variants nếu yêu cầu
    if (include_variants === "true") {
      query.include.push({
        model: ProductVariant,
        as: "variants",
        where:
          is_active !== undefined ? { is_active: is_active === "true" } : {},
        required: false,
        order: [["sort_order", "ASC"]],
      });
    }

    // Bao gồm images nếu yêu cầu
    if (include_images === "true") {
      query.include.push({
        model: ProductImage,
        as: "images",
        required: false,
        order: [
          ["is_primary", "DESC"],
          ["sort_order", "ASC"],
        ],
      });
    }

    const { count, rows } = await Product.findAndCountAll(query);

    return res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      products: rows.map((product) => ({
        id: product.id,
        name: product.name,
        display_name: product.display_name,
        product_type: product.product_type,
        base_price: product.base_price,
        is_customizable: product.is_customizable,
        is_required: product.is_required,
        is_active: product.is_active,
        sort_order: product.sort_order,
        collection: {
          id: product.collection.id,
          name: product.collection.name,
          display_name: product.collection.display_name,
        },
        variants:
          include_variants === "true"
            ? product.variants.map((variant) => ({
                id: variant.id,
                variant_name: variant.variant_name,
                variant_value: variant.variant_value,
                price_adjustment: variant.price_adjustment,
                is_default: variant.is_default,
                is_active: variant.is_active,
                sort_order: variant.sort_order,
              }))
            : undefined,
        images:
          include_images === "true"
            ? product.images.map((image) => ({
                id: image.id,
                image_url: image.image_url,
                is_primary: image.is_primary,
                sort_order: image.sort_order,
              }))
            : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo sản phẩm mới
 */
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      display_name,
      collection_id,
      product_type,
      base_price = 0,
      is_customizable = true,
      is_required = false,
      is_active = true,
      sort_order = 0,
    } = req.body;

    // Kiểm tra collection tồn tại
    const collection = await Collection.findByPk(collection_id);
    if (!collection) {
      return res.status(404).json({ message: "Bộ sưu tập không tồn tại" });
    }

    // Tạo sản phẩm mới
    const product = await Product.create({
      name,
      display_name,
      collection_id,
      product_type,
      base_price,
      is_customizable,
      is_required,
      is_active,
      sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "create_product",
        resource_type: "products",
        resource_id: product.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Tạo sản phẩm thành công",
      product: {
        id: product.id,
        name: product.name,
        display_name: product.display_name,
        collection_id: product.collection_id,
        product_type: product.product_type,
        base_price: product.base_price,
        is_customizable: product.is_customizable,
        is_required: product.is_required,
        is_active: product.is_active,
        sort_order: product.sort_order,
        created_at: product.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật sản phẩm
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      display_name,
      collection_id,
      product_type,
      base_price,
      is_customizable,
      is_required,
      is_active,
      sort_order,
    } = req.body;

    // Tìm sản phẩm cần cập nhật
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Nếu thay đổi collection, kiểm tra collection mới tồn tại
    if (collection_id && collection_id !== product.collection_id) {
      const collection = await Collection.findByPk(collection_id);
      if (!collection) {
        return res.status(404).json({ message: "Bộ sưu tập không tồn tại" });
      }
    }

    // Cập nhật thông tin
    await product.update({
      name: name || product.name,
      display_name: display_name || product.display_name,
      collection_id: collection_id || product.collection_id,
      product_type: product_type || product.product_type,
      base_price: base_price !== undefined ? base_price : product.base_price,
      is_customizable:
        is_customizable !== undefined
          ? is_customizable
          : product.is_customizable,
      is_required:
        is_required !== undefined ? is_required : product.is_required,
      is_active: is_active !== undefined ? is_active : product.is_active,
      sort_order: sort_order !== undefined ? sort_order : product.sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_product",
        resource_type: "products",
        resource_id: id,
        created_at: new Date(),
      });
    }

    // Lấy thông tin sản phẩm với collection
    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: Collection, as: "collection" }],
    });

    return res.json({
      message: "Cập nhật sản phẩm thành công",
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        display_name: updatedProduct.display_name,
        product_type: updatedProduct.product_type,
        base_price: updatedProduct.base_price,
        is_customizable: updatedProduct.is_customizable,
        is_required: updatedProduct.is_required,
        is_active: updatedProduct.is_active,
        sort_order: updatedProduct.sort_order,
        collection: {
          id: updatedProduct.collection.id,
          name: updatedProduct.collection.name,
          display_name: updatedProduct.collection.display_name,
        },
        updated_at: updatedProduct.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa sản phẩm
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm cần xóa
    const product = await Product.findByPk(id, {
      include: [
        { model: ProductVariant, as: "variants" },
        { model: ProductImage, as: "images" },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Xóa tất cả variants liên quan
    if (product.variants && product.variants.length > 0) {
      await ProductVariant.destroy({ where: { product_id: id } });
    }

    // Xóa tất cả images liên quan
    if (product.images && product.images.length > 0) {
      await ProductImage.destroy({ where: { product_id: id } });
    }

    // Xóa sản phẩm
    await product.destroy();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "delete_product",
        resource_type: "products",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết sản phẩm theo ID
 */
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Collection, as: "collection" },
        {
          model: ProductVariant,
          as: "variants",
          order: [["sort_order", "ASC"]],
        },
        {
          model: ProductImage,
          as: "images",
          order: [
            ["is_primary", "DESC"],
            ["sort_order", "ASC"],
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    return res.json({
      product: {
        id: product.id,
        name: product.name,
        display_name: product.display_name,
        product_type: product.product_type,
        base_price: product.base_price,
        is_customizable: product.is_customizable,
        is_required: product.is_required,
        is_active: product.is_active,
        sort_order: product.sort_order,
        created_at: product.created_at,
        updated_at: product.updated_at,
        collection: {
          id: product.collection.id,
          name: product.collection.name,
          display_name: product.collection.display_name,
        },
        variants: product.variants.map((variant) => ({
          id: variant.id,
          variant_name: variant.variant_name,
          variant_value: variant.variant_value,
          price_adjustment: variant.price_adjustment,
          is_default: variant.is_default,
          is_active: variant.is_active,
          sort_order: variant.sort_order,
        })),
        images: product.images.map((image) => ({
          id: image.id,
          image_url: image.image_url,
          is_primary: image.is_primary,
          variant_id: image.variant_id,
          sort_order: image.sort_order,
          uploaded_at: image.uploaded_at,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
