"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("password_resets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Tạo index cho token (unique)
    await queryInterface.addIndex("password_resets", ["token"], {
      name: "idx_password_resets_token",
      unique: true,
    });

    // Tạo index cho user_id
    await queryInterface.addIndex("password_resets", ["user_id"], {
      name: "idx_password_resets_user",
    });

    // Tạo index cho expires_at để tối ưu cleanup tokens hết hạn
    await queryInterface.addIndex("password_resets", ["expires_at"], {
      name: "idx_password_resets_expires",
    });

    // Tạo index cho used_at để tối ưu truy vấn tokens đã sử dụng
    await queryInterface.addIndex("password_resets", ["used_at"], {
      name: "idx_password_resets_used",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("password_resets");
  },
};
