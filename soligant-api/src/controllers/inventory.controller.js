const {
  Inventory,
  Product,
  ProductVariant,
  AuditLog,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

/**
 * Lấy danh sách tồn kho
 */
exports.getInventory = async (req, res, next) => {
  try {
    const {
      product_id,
      variant_id,
      low_stock,
      sort_by = "last_updated_at",
      sort_direction = "DESC",
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * parseInt(limit);

    // Xây dựng điều kiện tìm kiếm
    const where = {};

    if (product_id) {
      where.product_id = product_id;
    }

    if (variant_id) {
      where.variant_id = variant_id === "null" ? null : variant_id;
    }

    // Lọc sản phẩm có tồn kho thấp
    if (low_stock === "true") {
      where[Op.and] = [
        { current_stock: { [Op.lte]: sequelize.col("min_stock_alert") } },
        { current_stock: { [Op.gt]: 0 } },
      ];
    } else if (low_stock === "out") {
      // Lọc sản phẩm hết hàng
      where.current_stock = 0;
    }

    // Xác định thứ tự sắp xếp
    const validSortColumns = ["current_stock", "last_updated_at"];
    const sortColumn = validSortColumns.includes(sort_by)
      ? sort_by
      : "last_updated_at";
    const sortDir = sort_direction.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Query cơ bản
    const query = {
      where,
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "display_name", "product_type"],
        },
        {
          model: ProductVariant,
          as: "variant",
          attributes: ["id", "variant_name", "variant_value"],
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortColumn, sortDir]],
    };

    const { count, rows } = await Inventory.findAndCountAll(query);

    return res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      inventory: rows.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        current_stock: item.current_stock,
        reserved_stock: item.reserved_stock,
        available_stock: item.current_stock - item.reserved_stock,
        min_stock_alert: item.min_stock_alert,
        last_updated_at: item.last_updated_at,
        product: {
          id: item.product.id,
          name: item.product.name,
          display_name: item.product.display_name,
          product_type: item.product.product_type,
        },
        variant: item.variant
          ? {
              id: item.variant.id,
              variant_name: item.variant.variant_name,
              variant_value: item.variant.variant_value,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy chi tiết tồn kho theo ID
 */
exports.getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findByPk(id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "display_name", "product_type"],
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

    return res.json({
      inventory: {
        id: inventory.id,
        product_id: inventory.product_id,
        variant_id: inventory.variant_id,
        current_stock: inventory.current_stock,
        reserved_stock: inventory.reserved_stock,
        available_stock: inventory.current_stock - inventory.reserved_stock,
        min_stock_alert: inventory.min_stock_alert,
        last_updated_at: inventory.last_updated_at,
        product: {
          id: inventory.product.id,
          name: inventory.product.name,
          display_name: inventory.product.display_name,
          product_type: inventory.product.product_type,
        },
        variant: inventory.variant
          ? {
              id: inventory.variant.id,
              variant_name: inventory.variant.variant_name,
              variant_value: inventory.variant.variant_value,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo hoặc cập nhật tồn kho
 */
exports.updateInventory = async (req, res, next) => {
  try {
    const {
      product_id,
      variant_id,
      current_stock,
      reserved_stock,
      min_stock_alert,
    } = req.body;

    // Kiểm tra product tồn tại
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra variant tồn tại nếu có
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

    // Tìm tồn kho hiện tại
    let inventory = await Inventory.findOne({
      where: {
        product_id,
        variant_id: variant_id || null,
      },
    });

    let message = "";

    if (inventory) {
      // Cập nhật tồn kho hiện tại
      await inventory.update({
        current_stock:
          current_stock !== undefined ? current_stock : inventory.current_stock,
        reserved_stock:
          reserved_stock !== undefined
            ? reserved_stock
            : inventory.reserved_stock,
        min_stock_alert:
          min_stock_alert !== undefined
            ? min_stock_alert
            : inventory.min_stock_alert,
        last_updated_at: new Date(),
      });

      message = "Cập nhật tồn kho thành công";
    } else {
      // Tạo mới tồn kho
      inventory = await Inventory.create({
        product_id,
        variant_id: variant_id || null,
        current_stock: current_stock || 0,
        reserved_stock: reserved_stock || 0,
        min_stock_alert: min_stock_alert || 5,
        last_updated_at: new Date(),
      });

      message = "Tạo tồn kho thành công";
    }

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: inventory ? "update_inventory" : "create_inventory",
        resource_type: "inventory",
        resource_id: inventory.id,
        created_at: new Date(),
      });
    }

    return res.json({
      message,
      inventory: {
        id: inventory.id,
        product_id: inventory.product_id,
        variant_id: inventory.variant_id,
        current_stock: inventory.current_stock,
        reserved_stock: inventory.reserved_stock,
        available_stock: inventory.current_stock - inventory.reserved_stock,
        min_stock_alert: inventory.min_stock_alert,
        last_updated_at: inventory.last_updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật tồn kho theo ID
 */
exports.updateInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { current_stock, reserved_stock, min_stock_alert } = req.body;

    // Tìm tồn kho cần cập nhật
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin tồn kho" });
    }

    // Cập nhật thông tin
    await inventory.update({
      current_stock:
        current_stock !== undefined ? current_stock : inventory.current_stock,
      reserved_stock:
        reserved_stock !== undefined
          ? reserved_stock
          : inventory.reserved_stock,
      min_stock_alert:
        min_stock_alert !== undefined
          ? min_stock_alert
          : inventory.min_stock_alert,
      last_updated_at: new Date(),
    });

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "update_inventory",
        resource_type: "inventory",
        resource_id: id,
        created_at: new Date(),
      });
    }

    return res.json({
      message: "Cập nhật tồn kho thành công",
      inventory: {
        id: inventory.id,
        product_id: inventory.product_id,
        variant_id: inventory.variant_id,
        current_stock: inventory.current_stock,
        reserved_stock: inventory.reserved_stock,
        available_stock: inventory.current_stock - inventory.reserved_stock,
        min_stock_alert: inventory.min_stock_alert,
        last_updated_at: inventory.last_updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kiểm tra tồn kho sản phẩm trước khi đặt hàng
 */
exports.checkInventoryAvailability = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const result = {
      available: true,
      unavailableItems: [],
    };

    for (const item of items) {
      const { product_id, variant_id, quantity = 1 } = item;

      // Tìm tồn kho
      const inventory = await Inventory.findOne({
        where: {
          product_id,
          variant_id: variant_id || null,
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["name", "display_name"],
          },
          {
            model: ProductVariant,
            as: "variant",
            attributes: ["variant_name", "variant_value"],
            required: false,
          },
        ],
      });

      // Nếu không tìm thấy tồn kho hoặc không đủ số lượng
      if (
        !inventory ||
        inventory.current_stock - inventory.reserved_stock < quantity
      ) {
        result.available = false;

        const unavailableItem = {
          product_id,
          variant_id: variant_id || null,
          requested_quantity: quantity,
          available_quantity: inventory
            ? inventory.current_stock - inventory.reserved_stock
            : 0,
          product_info: inventory
            ? {
                name: inventory.product.name,
                display_name: inventory.product.display_name,
                variant: inventory.variant
                  ? `${inventory.variant.variant_name}: ${inventory.variant.variant_value}`
                  : null,
              }
            : null,
        };

        result.unavailableItems.push(unavailableItem);
      }
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật tồn kho khi đơn hàng được tạo (reserved_stock)
 */
exports.reserveInventory = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const result = {
      reserved: true,
      items: [],
    };

    for (const item of items) {
      const { product_id, variant_id, quantity = 1 } = item;

      // Tìm tồn kho
      const inventory = await Inventory.findOne({
        where: {
          product_id,
          variant_id: variant_id || null,
        },
        lock: transaction.LOCK.UPDATE, // Lock row for update
      });

      // Nếu không tìm thấy tồn kho hoặc không đủ số lượng
      if (
        !inventory ||
        inventory.current_stock - inventory.reserved_stock < quantity
      ) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Không đủ tồn kho để đặt hàng",
          product_id,
          variant_id: variant_id || null,
          requested_quantity: quantity,
          available_quantity: inventory
            ? inventory.current_stock - inventory.reserved_stock
            : 0,
        });
      }

      // Cập nhật reserved_stock
      await inventory.update(
        {
          reserved_stock: inventory.reserved_stock + quantity,
          last_updated_at: new Date(),
        },
        { transaction }
      );

      result.items.push({
        product_id,
        variant_id: variant_id || null,
        quantity,
        new_reserved_stock: inventory.reserved_stock + quantity,
        current_stock: inventory.current_stock,
      });
    }

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "reserve_inventory",
        resource_type: "inventory",
        resource_id: null, // Không có resource_id cụ thể
        created_at: new Date(),
      });
    }

    return res.json(result);
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};

/**
 * Cập nhật tồn kho khi đơn hàng hoàn thành (current_stock và reserved_stock)
 */
exports.completeInventory = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const result = {
      completed: true,
      items: [],
    };

    for (const item of items) {
      const { product_id, variant_id, quantity = 1 } = item;

      // Tìm tồn kho
      const inventory = await Inventory.findOne({
        where: {
          product_id,
          variant_id: variant_id || null,
        },
        lock: transaction.LOCK.UPDATE, // Lock row for update
      });

      if (!inventory) {
        await transaction.rollback();
        return res.status(404).json({
          message: "Không tìm thấy thông tin tồn kho",
          product_id,
          variant_id: variant_id || null,
        });
      }

      // Kiểm tra reserved_stock
      if (inventory.reserved_stock < quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Số lượng reserved_stock không đủ",
          product_id,
          variant_id: variant_id || null,
          requested_quantity: quantity,
          reserved_stock: inventory.reserved_stock,
        });
      }

      // Cập nhật current_stock và reserved_stock
      await inventory.update(
        {
          current_stock: inventory.current_stock - quantity,
          reserved_stock: inventory.reserved_stock - quantity,
          last_updated_at: new Date(),
        },
        { transaction }
      );

      result.items.push({
        product_id,
        variant_id: variant_id || null,
        quantity,
        new_current_stock: inventory.current_stock - quantity,
        new_reserved_stock: inventory.reserved_stock - quantity,
      });
    }

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "complete_inventory",
        resource_type: "inventory",
        resource_id: null, // Không có resource_id cụ thể
        created_at: new Date(),
      });
    }

    return res.json(result);
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};

/**
 * Huỷ đặt hàng, trả lại reserved_stock
 */
exports.cancelReservation = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const result = {
      cancelled: true,
      items: [],
    };

    for (const item of items) {
      const { product_id, variant_id, quantity = 1 } = item;

      // Tìm tồn kho
      const inventory = await Inventory.findOne({
        where: {
          product_id,
          variant_id: variant_id || null,
        },
        lock: transaction.LOCK.UPDATE, // Lock row for update
      });

      if (!inventory) {
        await transaction.rollback();
        return res.status(404).json({
          message: "Không tìm thấy thông tin tồn kho",
          product_id,
          variant_id: variant_id || null,
        });
      }

      // Kiểm tra reserved_stock
      if (inventory.reserved_stock < quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Số lượng reserved_stock không đủ để huỷ",
          product_id,
          variant_id: variant_id || null,
          requested_quantity: quantity,
          reserved_stock: inventory.reserved_stock,
        });
      }

      // Cập nhật reserved_stock
      await inventory.update(
        {
          reserved_stock: inventory.reserved_stock - quantity,
          last_updated_at: new Date(),
        },
        { transaction }
      );

      result.items.push({
        product_id,
        variant_id: variant_id || null,
        quantity,
        new_reserved_stock: inventory.reserved_stock - quantity,
        current_stock: inventory.current_stock,
      });
    }

    // Commit transaction
    await transaction.commit();

    // Ghi log
    if (req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: "cancel_reservation",
        resource_type: "inventory",
        resource_id: null, // Không có resource_id cụ thể
        created_at: new Date(),
      });
    }

    return res.json(result);
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    next(error);
  }
};

/**
 * Lấy danh sách sản phẩm sắp hết hàng
 */
exports.getLowStockItems = async (req, res, next) => {
  try {
    const lowStockItems = await Inventory.findAll({
      where: {
        [Op.and]: [
          { current_stock: { [Op.lte]: sequelize.col("min_stock_alert") } },
          { current_stock: { [Op.gt]: 0 } },
        ],
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "display_name", "product_type"],
        },
        {
          model: ProductVariant,
          as: "variant",
          attributes: ["id", "variant_name", "variant_value"],
          required: false,
        },
      ],
      order: [["current_stock", "ASC"]],
    });

    return res.json({
      total: lowStockItems.length,
      lowStockItems: lowStockItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        current_stock: item.current_stock,
        reserved_stock: item.reserved_stock,
        available_stock: item.current_stock - item.reserved_stock,
        min_stock_alert: item.min_stock_alert,
        last_updated_at: item.last_updated_at,
        product: {
          id: item.product.id,
          name: item.product.name,
          display_name: item.product.display_name,
          product_type: item.product.product_type,
        },
        variant: item.variant
          ? {
              id: item.variant.id,
              variant_name: item.variant.variant_name,
              variant_value: item.variant.variant_value,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách sản phẩm hết hàng
 */
exports.getOutOfStockItems = async (req, res, next) => {
  try {
    const outOfStockItems = await Inventory.findAll({
      where: { current_stock: 0 },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "display_name", "product_type"],
        },
        {
          model: ProductVariant,
          as: "variant",
          attributes: ["id", "variant_name", "variant_value"],
          required: false,
        },
      ],
      order: [["last_updated_at", "DESC"]],
    });

    return res.json({
      total: outOfStockItems.length,
      outOfStockItems: outOfStockItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        current_stock: item.current_stock,
        reserved_stock: item.reserved_stock,
        min_stock_alert: item.min_stock_alert,
        last_updated_at: item.last_updated_at,
        product: {
          id: item.product.id,
          name: item.product.name,
          display_name: item.product.display_name,
          product_type: item.product.product_type,
        },
        variant: item.variant
          ? {
              id: item.variant.id,
              variant_name: item.variant.variant_name,
              variant_value: item.variant.variant_value,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};
