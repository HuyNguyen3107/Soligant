const bcrypt = require("bcrypt");
const { User, Role, UserRole, AuditLog } = require("../models");
const { Op } = require("sequelize");

/**
 * Lấy danh sách nhân viên
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, is_active } = req.query;
    const offset = (page - 1) * limit;

    // Xây dựng điều kiện tìm kiếm
    const where = {};

    if (search) {
      where[Op.or] = [
        { full_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    // Query cơ bản
    const query = {
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
      order: [["created_at", "DESC"]],
    };

    // Nếu lọc theo role
    if (role) {
      query.include[0].where = { name: role };
    }

    // Thực hiện truy vấn
    const { count, rows } = await User.findAndCountAll(query);
    return res.json({
      success: true,
      data: rows.map((user) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        is_active: user.is_active,
        roles: user.roles.map((role) => role.name),
        created_at: user.created_at,
      })),
      meta: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo nhân viên mới
 */
exports.createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      roles,
      is_active = true,
    } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    // Hash mật khẩu
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const user = await User.create({
      email,
      password_hash,
      full_name,
      phone,
      is_active,
    });

    // Gán vai trò cho user
    if (roles && roles.length > 0) {
      const roleRecords = await Role.findAll({
        where: { name: { [Op.in]: roles } },
      });

      if (roleRecords.length > 0) {
        await Promise.all(
          roleRecords.map((role) =>
            UserRole.create({ user_id: user.id, role_id: role.id })
          )
        );
      }
    }

    // Lấy thông tin user với roles
    const userWithRoles = await User.findByPk(user.id, {
      include: [{ model: Role, as: "roles" }],
    });

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "create_user",
      resource_type: "users",
      resource_id: user.id,
      created_at: new Date(),
    });
    return res.status(201).json({
      success: true,
      message: "Tạo nhân viên thành công",
      data: {
        id: userWithRoles.id,
        email: userWithRoles.email,
        full_name: userWithRoles.full_name,
        phone: userWithRoles.phone,
        is_active: userWithRoles.is_active,
        roles: userWithRoles.roles.map((role) => role.name),
        created_at: userWithRoles.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật thông tin nhân viên
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, phone, roles, is_active } = req.body;

    // Tìm user cần cập nhật
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    // Cập nhật thông tin
    await user.update({
      full_name: full_name !== undefined ? full_name : user.full_name,
      phone: phone !== undefined ? phone : user.phone,
      is_active: is_active !== undefined ? is_active : user.is_active,
    });

    // Cập nhật roles nếu có
    if (roles && roles.length > 0) {
      // Xóa tất cả roles hiện tại
      await UserRole.destroy({ where: { user_id: id } });

      // Gán roles mới
      const roleRecords = await Role.findAll({
        where: { name: { [Op.in]: roles } },
      });

      if (roleRecords.length > 0) {
        await Promise.all(
          roleRecords.map((role) =>
            UserRole.create({ user_id: user.id, role_id: role.id })
          )
        );
      }
    }

    // Lấy thông tin user đã cập nhật
    const updatedUser = await User.findByPk(id, {
      include: [{ model: Role, as: "roles" }],
    });

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "update_user",
      resource_type: "users",
      resource_id: id,
      created_at: new Date(),
    });

    return res.json({
      message: "Cập nhật nhân viên thành công",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        phone: updatedUser.phone,
        is_active: updatedUser.is_active,
        roles: updatedUser.roles.map((role) => role.name),
        updated_at: updatedUser.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đổi mật khẩu nhân viên
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Tìm user cần đổi mật khẩu
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    // Hash mật khẩu mới
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Cập nhật mật khẩu
    await user.update({ password_hash });

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "change_password",
      resource_type: "users",
      resource_id: id,
      created_at: new Date(),
    });

    return res.json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy thông tin nhân viên theo ID
 */
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{ model: Role, as: "roles" }],
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        is_active: user.is_active,
        roles: user.roles.map((role) => role.name),
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa nhân viên
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm user cần xóa
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    // Không cho phép xóa chính mình
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa tài khoản của chính mình",
      });
    }

    // Xóa các liên kết với roles trước
    await UserRole.destroy({ where: { user_id: id } });

    // Xóa user
    await user.destroy();

    // Ghi log
    await AuditLog.create({
      user_id: req.user.id,
      action: "delete_user",
      resource_type: "users",
      resource_id: id,
      created_at: new Date(),
    });

    return res.json({
      success: true,
      message: "Xóa nhân viên thành công",
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đổi mật khẩu cá nhân (user tự đổi)
 */
exports.changeMyPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    // Tìm user hiện tại
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password_hash
    );
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải khác với mật khẩu hiện tại",
      });
    }

    // Hash mật khẩu mới
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu
    await user.update({ password_hash });

    // Ghi log
    await AuditLog.create({
      user_id: userId,
      action: "change_my_password",
      resource_type: "users",
      resource_id: userId,
      created_at: new Date(),
    });

    return res.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    next(error);
  }
};
