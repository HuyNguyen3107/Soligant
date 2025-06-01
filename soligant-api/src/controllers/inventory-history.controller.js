const {
  InventoryHistory,
  Inventory,
  Product,
  ProductVariant,
  User,
} = require("../models");

/**
 * Lấy lịch sử tồn kho theo inventory_id
 */
exports.getInventoryHistory = async (req, res, next) => {
  try {
    const { inventory_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    // Kiểm tra inventory tồn tại
    const inventory = await Inventory.findByPk(inventory_id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "display_name"],
        },
        {
          model: ProductVariant,
          as: "variant",
          attributes: ["id", "variant_name", "variant_value"],
          required: false,
        },
      ],
    });

    if (!inventory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin tồn kho" });
    }

    // Lấy lịch sử
    const { count, rows } = await InventoryHistory.findAndCountAll({
      where: { inventory_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email"],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["created_at", "DESC"]],
    });

    return res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      inventory: {
        id: inventory.id,
        current_stock: inventory.current_stock,
        reserved_stock: inventory.reserved_stock,
        min_stock_alert: inventory.min_stock_alert,
        product: {
          id: inventory.product.id,
          name: inventory.product.name,
          display_name: inventory.product.display_name,
        },
        variant: inventory.variant
          ? {
              id: inventory.variant.id,
              variant_name: inventory.variant.variant_name,
              variant_value: inventory.variant.variant_value,
            }
          : null,
      },
      history: rows.map((entry) => ({
        id: entry.id,
        action_type: entry.action_type,
        previous_stock: entry.previous_stock,
        new_stock: entry.new_stock,
        previous_reserved: entry.previous_reserved,
        new_reserved: entry.new_reserved,
        notes: entry.notes,
        created_at: entry.created_at,
        user: entry.user
          ? {
              id: entry.user.id,
              full_name: entry.user.full_name,
              email: entry.user.email,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Thêm lịch sử tồn kho
 */
exports.addInventoryHistory = async (req, res, next) => {
  try {
    const {
      inventory_id,
      action_type,
      previous_stock,
      new_stock,
      previous_reserved,
      new_reserved,
      notes,
    } = req.body;

    // Kiểm tra inventory tồn tại
    const inventory = await Inventory.findByPk(inventory_id);
    if (!inventory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin tồn kho" });
    }

    // Kiểm tra action_type hợp lệ
    const validActionTypes = [
      "manual_adjustment",
      "order_reserved",
      "order_completed",
      "order_cancelled",
      "inventory_import",
      "inventory_export",
    ];

    if (!validActionTypes.includes(action_type)) {
      return res.status(400).json({
        message: "Loại hành động không hợp lệ",
        validActionTypes,
      });
    }

    // Tạo lịch sử
    const history = await InventoryHistory.create({
      inventory_id,
      user_id: req.user ? req.user.id : null,
      action_type,
      previous_stock,
      new_stock,
      previous_reserved,
      new_reserved,
      notes,
      created_at: new Date(),
    });

    return res.status(201).json({
      message: "Thêm lịch sử tồn kho thành công",
      history: {
        id: history.id,
        inventory_id: history.inventory_id,
        action_type: history.action_type,
        previous_stock: history.previous_stock,
        new_stock: history.new_stock,
        previous_reserved: history.previous_reserved,
        new_reserved: history.new_reserved,
        notes: history.notes,
        created_at: history.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy tất cả lịch sử tồn kho
 */
exports.getAllInventoryHistory = async (req, res, next) => {
  try {
    const {
      action_type,
      user_id,
      start_date,
      end_date,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * parseInt(limit);

    // Xây dựng điều kiện tìm kiếm
    const where = {};

    if (action_type) {
      where.action_type = action_type;
    }

    if (user_id) {
      where.user_id = user_id;
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

    // Lấy lịch sử
    const { count, rows } = await InventoryHistory.findAndCountAll({
      where,
      include: [
        {
          model: Inventory,
          as: "inventory",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "display_name"],
            },
            {
              model: ProductVariant,
              as: "variant",
              attributes: ["id", "variant_name", "variant_value"],
              required: false,
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email"],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["created_at", "DESC"]],
    });

    return res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      history: rows.map((entry) => ({
        id: entry.id,
        action_type: entry.action_type,
        previous_stock: entry.previous_stock,
        new_stock: entry.new_stock,
        previous_reserved: entry.previous_reserved,
        new_reserved: entry.new_reserved,
        notes: entry.notes,
        created_at: entry.created_at,
        inventory: {
          id: entry.inventory.id,
          current_stock: entry.inventory.current_stock,
          reserved_stock: entry.inventory.reserved_stock,
          product: {
            id: entry.inventory.product.id,
            name: entry.inventory.product.name,
            display_name: entry.inventory.product.display_name,
          },
          variant: entry.inventory.variant
            ? {
                id: entry.inventory.variant.id,
                variant_name: entry.inventory.variant.variant_name,
                variant_value: entry.inventory.variant.variant_value,
              }
            : null,
        },
        user: entry.user
          ? {
              id: entry.user.id,
              full_name: entry.user.full_name,
              email: entry.user.email,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};
