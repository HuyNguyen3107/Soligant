const {
  Role,
  Permission,
  UserRole,
  RolePermission,
  User,
  AuditLog,
} = require("../models");
const { Op } = require("sequelize");
const { createError } = require("../middlewares/error.middleware");

/**
 * Lấy danh sách roles
 */
exports.getRoles = async (req, res, next) => {
  try {
    const { include_permissions, include_users } = req.query;

    const query = {
      order: [["name", "ASC"]],
    };

    // Include permissions nếu yêu cầu
    if (include_permissions === "true") {
      query.include = [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] }, // Không lấy attributes từ bảng trung gian
          order: [["name", "ASC"]],
        },
      ];
    }

    // Include users nếu yêu cầu
    if (include_users === "true") {
      if (!query.include) query.include = [];
      query.include.push({
        model: User,
        as: "users",
        through: { attributes: [] },
        attributes: ["id", "email", "full_name", "is_active"],
        order: [["full_name", "ASC"]],
      });
    }

    const roles = await Role.findAll(query);

    return res.json({
      roles: roles.map((role) => ({
        id: role.id,
        name: role.name,
        created_at: role.created_at,
        permissions:
          include_permissions === "true"
            ? role.permissions.map((p) => ({
                id: p.id,
                name: p.name,
              }))
            : undefined,
        users:
          include_users === "true"
            ? role.users.map((u) => ({
                id: u.id,
                email: u.email,
                full_name: u.full_name,
                is_active: u.is_active,
              }))
            : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy role theo ID
 */
exports.getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
          order: [["name", "ASC"]],
        },
        {
          model: User,
          as: "users",
          through: { attributes: [] },
          attributes: ["id", "email", "full_name", "is_active"],
          order: [["full_name", "ASC"]],
        },
      ],
    });

    if (!role) {
      return next(createError(404, "Role không tồn tại"));
    }

    return res.json({
      role: {
        id: role.id,
        name: role.name,
        created_at: role.created_at,
        permissions: role.permissions.map((p) => ({
          id: p.id,
          name: p.name,
        })),
        users: role.users.map((u) => ({
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          is_active: u.is_active,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo role mới
 */
exports.createRole = async (req, res, next) => {
  try {
    const { name, permissions = [] } = req.body;

    if (!name) {
      return next(createError(400, "Tên role là bắt buộc"));
    }

    // Kiểm tra role đã tồn tại chưa
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return next(createError(400, "Role đã tồn tại"));
    }

    // Tạo role
    const role = await Role.create({
      name,
      created_at: new Date(),
    });

    // Gán permissions nếu có
    if (permissions.length > 0) {
      const validPermissions = await Permission.findAll({
        where: { id: { [Op.in]: permissions } },
      });

      if (validPermissions.length !== permissions.length) {
        return next(createError(400, "Một số permission không hợp lệ"));
      }

      await role.setPermissions(validPermissions);
    }

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "role.create",
      details: JSON.stringify({ role_id: role.id, name }),
      created_at: new Date(),
    });

    return res.status(201).json({
      message: "Tạo role thành công",
      role: {
        id: role.id,
        name: role.name,
        created_at: role.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật role
 */
exports.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return next(createError(404, "Role không tồn tại"));
    }

    // Không cho phép sửa role admin, manager, employee
    const systemRoles = ["admin", "manager", "employee"];
    if (systemRoles.includes(role.name)) {
      return next(createError(403, "Không thể sửa role hệ thống"));
    }

    // Cập nhật name nếu có
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole && existingRole.id !== role.id) {
        return next(createError(400, "Tên role đã tồn tại"));
      }
      role.name = name;
      await role.save();
    }

    // Cập nhật permissions nếu có
    if (permissions && Array.isArray(permissions)) {
      const validPermissions = await Permission.findAll({
        where: { id: { [Op.in]: permissions } },
      });

      if (validPermissions.length !== permissions.length) {
        return next(createError(400, "Một số permission không hợp lệ"));
      }

      await role.setPermissions(validPermissions);
    }

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "role.update",
      details: JSON.stringify({
        role_id: role.id,
        changes: { name, permissions },
      }),
      created_at: new Date(),
    });

    return res.json({
      message: "Cập nhật role thành công",
      role: {
        id: role.id,
        name: role.name,
        created_at: role.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa role
 */
exports.deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return next(createError(404, "Role không tồn tại"));
    }

    // Không cho phép xóa role hệ thống
    const systemRoles = ["admin", "manager", "employee"];
    if (systemRoles.includes(role.name)) {
      return next(createError(403, "Không thể xóa role hệ thống"));
    }

    // Kiểm tra có user nào đang sử dụng role này không
    const userCount = await UserRole.count({ where: { role_id: id } });
    if (userCount > 0) {
      return next(
        createError(
          400,
          `Không thể xóa role. Có ${userCount} user đang sử dụng role này`
        )
      );
    }

    // Xóa relationships trước
    await RolePermission.destroy({ where: { role_id: id } });

    // Xóa role
    await role.destroy();

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "role.delete",
      details: JSON.stringify({ role_id: id, name: role.name }),
      created_at: new Date(),
    });

    return res.json({ message: "Xóa role thành công" });
  } catch (error) {
    next(error);
  }
};
