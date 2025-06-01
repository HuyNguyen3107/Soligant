const { Collection, Category, Product, AuditLog } = require("../models");
const { Op } = require("sequelize");

/**
 * Lấy danh sách bộ sưu tập
 */
exports.getCollections = async (req, res, next) => {
  try {
    const {
      category_id,
      is_active,
      include_products,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    // Xây dựng điều kiện tìm kiếm
    const where = {};

    if (category_id) {
      where.category_id = category_id;
    }

    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    // Query cơ bản
    const query = {
      where,
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [
        ["sort_order", "ASC"],
        ["name", "ASC"],
      ],
    };

    // Bao gồm products nếu yêu cầu
    if (include_products === "true") {
      query.include.push({
        model: Product,
        as: "products",
        where:
          is_active !== undefined ? { is_active: is_active === "true" } : {},
        required: false,
        attributes: [
          "id",
          "name",
          "display_name",
          "product_type",
          "is_active",
          "sort_order",
        ],
        order: [["sort_order", "ASC"]],
      });
    }

    const { count, rows } = await Collection.findAndCountAll(query);

    return res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      collections: rows.map((collection) => ({
        id: collection.id,
        name: collection.name,
        display_name: collection.display_name,
        preview_image_url: collection.preview_image_url,
        is_active: collection.is_active,
        sort_order: collection.sort_order,
        category: {
          id: collection.category.id,
          name: collection.category.name,
          display_name: collection.category.display_name,
        },
        products:
          include_products === "true"
            ? collection.products.map((product) => ({
                id: product.id,
                name: product.name,
                display_name: product.display_name,
                product_type: product.product_type,
                is_active: product.is_active,
                sort_order: product.sort_order,
              }))
            : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo bộ sưu tập mới
 */
exports.createCollection = async (req, res, next) => {
  try {
    const {
      name,
      display_name,
      category_id,
      preview_image_url,
      is_active = true,
      sort_order = 0,
    } = req.body;

    // Kiểm tra category tồn tại
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // Kiểm tra tên đã tồn tại trong category này chưa
    const existingCollection = await Collection.findOne({
      where: {
        name,
        category_id,
      },
    });

    if (existingCollection) {
      return res
        .status(409)
        .json({ message: "Tên bộ sưu tập đã tồn tại trong danh mục này" });
    }

    // Tạo bộ sưu tập mới
    const collection = await Collection.create({
      name,
      display_name,
      category_id,
      preview_image_url,
      is_active,
      sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "create_collection",
        resource_type: "collections",
        resource_id: collection.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Tạo bộ sưu tập thành công",
      collection: {
        id: collection.id,
        name: collection.name,
        display_name: collection.display_name,
        category_id: collection.category_id,
        preview_image_url: collection.preview_image_url,
        is_active: collection.is_active,
        sort_order: collection.sort_order,
        created_at: collection.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật bộ sưu tập
 */
exports.updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      display_name,
      category_id,
      preview_image_url,
      is_active,
      sort_order,
    } = req.body;

    // Tìm bộ sưu tập cần cập nhật
    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({ message: "Không tìm thấy bộ sưu tập" });
    }

    // Nếu thay đổi category, kiểm tra category mới tồn tại
    if (category_id && category_id !== collection.category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ message: "Danh mục không tồn tại" });
      }
    }

    // Kiểm tra tên mới đã tồn tại trong category này chưa (nếu thay đổi tên hoặc category)
    if (
      (name && name !== collection.name) ||
      (category_id && category_id !== collection.category_id)
    ) {
      const checkCategory = category_id || collection.category_id;
      const checkName = name || collection.name;

      const existingCollection = await Collection.findOne({
        where: {
          name: checkName,
          category_id: checkCategory,
          id: { [Op.ne]: id },
        },
      });

      if (existingCollection) {
        return res
          .status(409)
          .json({ message: "Tên bộ sưu tập đã tồn tại trong danh mục này" });
      }
    }

    // Cập nhật thông tin
    await collection.update({
      name: name || collection.name,
      display_name: display_name || collection.display_name,
      category_id: category_id || collection.category_id,
      preview_image_url:
        preview_image_url !== undefined
          ? preview_image_url
          : collection.preview_image_url,
      is_active: is_active !== undefined ? is_active : collection.is_active,
      sort_order: sort_order !== undefined ? sort_order : collection.sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_collection",
        resource_type: "collections",
        resource_id: id,
        created_at: new Date(),
      });
    }

    // Lấy thông tin bộ sưu tập với category
    const updatedCollection = await Collection.findByPk(id, {
      include: [{ model: Category, as: "category" }],
    });

    return res.json({
      message: "Cập nhật bộ sưu tập thành công",
      collection: {
        id: updatedCollection.id,
        name: updatedCollection.name,
        display_name: updatedCollection.display_name,
        preview_image_url: updatedCollection.preview_image_url,
        is_active: updatedCollection.is_active,
        sort_order: updatedCollection.sort_order,
        category: {
          id: updatedCollection.category.id,
          name: updatedCollection.category.name,
          display_name: updatedCollection.category.display_name,
        },
        updated_at: updatedCollection.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa bộ sưu tập
 */
exports.deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm bộ sưu tập cần xóa
    const collection = await Collection.findByPk(id, {
      include: [{ model: Product, as: "products" }],
    });

    if (!collection) {
      return res.status(404).json({ message: "Không tìm thấy bộ sưu tập" });
    }

    // Kiểm tra xem bộ sưu tập có chứa products không
    if (collection.products && collection.products.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa bộ sưu tập đang chứa sản phẩm",
        count: collection.products.length,
      });
    }

    // Xóa bộ sưu tập
    await collection.destroy();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "delete_collection",
        resource_type: "collections",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa bộ sưu tập thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết bộ sưu tập theo ID
 */
exports.getCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { include_products } = req.query;

    // Xây dựng query
    const query = {
      include: [{ model: Category, as: "category" }],
    };

    // Bao gồm products nếu yêu cầu
    if (include_products === "true") {
      query.include.push({
        model: Product,
        as: "products",
        order: [["sort_order", "ASC"]],
      });
    }

    const collection = await Collection.findByPk(id, query);

    if (!collection) {
      return res.status(404).json({ message: "Không tìm thấy bộ sưu tập" });
    }

    return res.json({
      collection: {
        id: collection.id,
        name: collection.name,
        display_name: collection.display_name,
        preview_image_url: collection.preview_image_url,
        is_active: collection.is_active,
        sort_order: collection.sort_order,
        created_at: collection.created_at,
        updated_at: collection.updated_at,
        category: {
          id: collection.category.id,
          name: collection.category.name,
          display_name: collection.category.display_name,
        },
        products:
          include_products === "true"
            ? collection.products.map((product) => ({
                id: product.id,
                name: product.name,
                display_name: product.display_name,
                product_type: product.product_type,
                base_price: product.base_price,
                is_customizable: product.is_customizable,
                is_required: product.is_required,
                is_active: product.is_active,
                sort_order: product.sort_order,
              }))
            : undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};
