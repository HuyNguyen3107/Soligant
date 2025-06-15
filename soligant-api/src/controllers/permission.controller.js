const { Permission, Role, RolePermission, AuditLog } = require("../models");
const { Op } = require("sequelize");
const { createError } = require("../middlewares/error.middleware");

/**
 * Lấy danh sách permissions
 */
exports.getPermissions = async (req, res, next) => {
  try {
    const { include_roles, group_by_module } = req.query;

    const query = {
      order: [["name", "ASC"]],
    };

    // Include roles nếu yêu cầu
    if (include_roles === "true") {
      query.include = [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ["id", "name"],
          order: [["name", "ASC"]],
        },
      ];
    }

    const permissions = await Permission.findAll(query);

    let result = permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      module: permission.name.split(".")[0], // Extract module from permission name
      action: permission.name.split(".")[1], // Extract action from permission name
      created_at: permission.created_at,
      roles:
        include_roles === "true"
          ? permission.roles.map((r) => ({
              id: r.id,
              name: r.name,
            }))
          : undefined,
    }));

    // Group by module nếu yêu cầu
    if (group_by_module === "true") {
      const grouped = {};
      result.forEach((permission) => {
        const module = permission.module;
        if (!grouped[module]) {
          grouped[module] = [];
        }
        grouped[module].push(permission);
      });
      result = grouped;
    }

    return res.json({
      permissions: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy permission theo ID
 */
exports.getPermissionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ["id", "name"],
          order: [["name", "ASC"]],
        },
      ],
    });

    if (!permission) {
      return next(createError(404, "Permission không tồn tại"));
    }

    return res.json({
      permission: {
        id: permission.id,
        name: permission.name,
        module: permission.name.split(".")[0],
        action: permission.name.split(".")[1],
        created_at: permission.created_at,
        roles: permission.roles.map((r) => ({
          id: r.id,
          name: r.name,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo permission mới
 */
exports.createPermission = async (req, res, next) => {
  try {
    const { name, roles = [] } = req.body;

    if (!name) {
      return next(createError(400, "Tên permission là bắt buộc"));
    }

    // Validate permission name format (module.action)
    if (!name.includes(".")) {
      return next(
        createError(400, "Tên permission phải có format: module.action")
      );
    }

    // Kiểm tra permission đã tồn tại chưa
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return next(createError(400, "Permission đã tồn tại"));
    }

    // Tạo permission
    const permission = await Permission.create({
      name,
      created_at: new Date(),
    });

    // Gán roles nếu có
    if (roles.length > 0) {
      const validRoles = await Role.findAll({
        where: { id: { [Op.in]: roles } },
      });

      if (validRoles.length !== roles.length) {
        return next(createError(400, "Một số role không hợp lệ"));
      }

      await permission.setRoles(validRoles);
    }

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "permission.create",
      details: JSON.stringify({ permission_id: permission.id, name }),
      created_at: new Date(),
    });

    return res.status(201).json({
      message: "Tạo permission thành công",
      permission: {
        id: permission.id,
        name: permission.name,
        module: permission.name.split(".")[0],
        action: permission.name.split(".")[1],
        created_at: permission.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật permission
 */
exports.updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, roles } = req.body;

    const permission = await Permission.findByPk(id);
    if (!permission) {
      return next(createError(404, "Permission không tồn tại"));
    }

    // Không cho phép sửa permissions hệ thống
    const systemPermissions = [
      "users.view",
      "users.create",
      "users.update",
      "users.delete",
      "categories.view",
      "categories.create",
      "categories.update",
      "categories.delete",
      "collections.view",
      "collections.create",
      "collections.update",
      "collections.delete",
      "products.view",
      "products.create",
      "products.update",
      "products.delete",
      "orders.view",
      "orders.create",
      "orders.update",
      "orders.delete",
      "orders.assign",
      "inventory.view",
      "inventory.update",
      "statistics.view",
    ];

    if (systemPermissions.includes(permission.name)) {
      return next(createError(403, "Không thể sửa permission hệ thống"));
    }

    // Cập nhật name nếu có
    if (name && name !== permission.name) {
      if (!name.includes(".")) {
        return next(
          createError(400, "Tên permission phải có format: module.action")
        );
      }

      const existingPermission = await Permission.findOne({ where: { name } });
      if (existingPermission && existingPermission.id !== permission.id) {
        return next(createError(400, "Tên permission đã tồn tại"));
      }

      permission.name = name;
      await permission.save();
    }

    // Cập nhật roles nếu có
    if (roles && Array.isArray(roles)) {
      const validRoles = await Role.findAll({
        where: { id: { [Op.in]: roles } },
      });

      if (validRoles.length !== roles.length) {
        return next(createError(400, "Một số role không hợp lệ"));
      }

      await permission.setRoles(validRoles);
    }

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "permission.update",
      details: JSON.stringify({
        permission_id: permission.id,
        changes: { name, roles },
      }),
      created_at: new Date(),
    });

    return res.json({
      message: "Cập nhật permission thành công",
      permission: {
        id: permission.id,
        name: permission.name,
        module: permission.name.split(".")[0],
        action: permission.name.split(".")[1],
        created_at: permission.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa permission
 */
exports.deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id);
    if (!permission) {
      return next(createError(404, "Permission không tồn tại"));
    }

    // Không cho phép xóa permissions hệ thống
    const systemPermissions = [
      "users.view",
      "users.create",
      "users.update",
      "users.delete",
      "categories.view",
      "categories.create",
      "categories.update",
      "categories.delete",
      "collections.view",
      "collections.create",
      "collections.update",
      "collections.delete",
      "products.view",
      "products.create",
      "products.update",
      "products.delete",
      "orders.view",
      "orders.create",
      "orders.update",
      "orders.delete",
      "orders.assign",
      "inventory.view",
      "inventory.update",
      "statistics.view",
    ];

    if (systemPermissions.includes(permission.name)) {
      return next(createError(403, "Không thể xóa permission hệ thống"));
    }

    // Xóa relationships trước
    await RolePermission.destroy({ where: { permission_id: id } });

    // Xóa permission
    await permission.destroy();

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "permission.delete",
      details: JSON.stringify({ permission_id: id, name: permission.name }),
      created_at: new Date(),
    });

    return res.json({ message: "Xóa permission thành công" });
  } catch (error) {
    next(error);
  }
};
