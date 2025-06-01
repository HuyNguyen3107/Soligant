const { Category, Collection, AuditLog } = require("../models");
const { Op } = require("sequelize");

/**
 * Lấy danh sách danh mục
 */
exports.getCategories = async (req, res, next) => {
  try {
    const { is_active, include_collections } = req.query;

    // Xây dựng query
    const query = {
      order: [
        ["sort_order", "ASC"],
        ["name", "ASC"],
      ],
    };

    // Thêm điều kiện lọc theo trạng thái
    if (is_active !== undefined) {
      query.where = { is_active: is_active === "true" };
    }

    // Bao gồm collections nếu yêu cầu
    if (include_collections === "true") {
      query.include = [
        {
          model: Collection,
          as: "collections",
          where:
            is_active !== undefined ? { is_active: is_active === "true" } : {},
          required: false,
          order: [["sort_order", "ASC"]],
        },
      ];
    }

    const categories = await Category.findAll(query);

    return res.json({
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        display_name: category.display_name,
        is_active: category.is_active,
        sort_order: category.sort_order,
        collections:
          include_collections === "true"
            ? category.collections.map((collection) => ({
                id: collection.id,
                name: collection.name,
                display_name: collection.display_name,
                preview_image_url: collection.preview_image_url,
                is_active: collection.is_active,
                sort_order: collection.sort_order,
              }))
            : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo danh mục mới
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, display_name, is_active = true, sort_order = 0 } = req.body;

    // Kiểm tra tên đã tồn tại chưa
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(409).json({ message: "Tên danh mục đã tồn tại" });
    }

    // Tạo danh mục mới
    const category = await Category.create({
      name,
      display_name,
      is_active,
      sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "create_category",
        resource_type: "categories",
        resource_id: category.id,
        created_at: new Date(),
      });
    }

    return res.status(201).json({
      message: "Tạo danh mục thành công",
      category: {
        id: category.id,
        name: category.name,
        display_name: category.display_name,
        is_active: category.is_active,
        sort_order: category.sort_order,
        created_at: category.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật danh mục
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, display_name, is_active, sort_order } = req.body;

    // Tìm danh mục cần cập nhật
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Kiểm tra tên mới đã tồn tại chưa (nếu thay đổi tên)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return res.status(409).json({ message: "Tên danh mục đã tồn tại" });
      }
    }

    // Cập nhật thông tin
    await category.update({
      name: name || category.name,
      display_name: display_name || category.display_name,
      is_active: is_active !== undefined ? is_active : category.is_active,
      sort_order: sort_order !== undefined ? sort_order : category.sort_order,
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_category",
        resource_type: "categories",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật danh mục thành công",
      category: {
        id: category.id,
        name: category.name,
        display_name: category.display_name,
        is_active: category.is_active,
        sort_order: category.sort_order,
        updated_at: category.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa danh mục
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm danh mục cần xóa
    const category = await Category.findByPk(id, {
      include: [{ model: Collection, as: "collections" }],
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Kiểm tra xem danh mục có chứa collections không
    if (category.collections && category.collections.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa danh mục đang chứa bộ sưu tập",
        count: category.collections.length,
      });
    }

    // Xóa danh mục
    await category.destroy();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "delete_category",
        resource_type: "categories",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết danh mục theo ID
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Collection,
          as: "collections",
          order: [["sort_order", "ASC"]],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    return res.json({
      category: {
        id: category.id,
        name: category.name,
        display_name: category.display_name,
        is_active: category.is_active,
        sort_order: category.sort_order,
        created_at: category.created_at,
        updated_at: category.updated_at,
        collections: category.collections.map((collection) => ({
          id: collection.id,
          name: collection.name,
          display_name: collection.display_name,
          preview_image_url: collection.preview_image_url,
          is_active: collection.is_active,
          sort_order: collection.sort_order,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
