"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("refresh_tokens", {
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
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      revoked_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Tạo index cho token (unique)
    await queryInterface.addIndex("refresh_tokens", ["token"], {
      name: "idx_refresh_tokens_token",
      unique: true,
    });

    // Tạo index cho user_id
    await queryInterface.addIndex("refresh_tokens", ["user_id"], {
      name: "idx_refresh_tokens_user",
    });

    // Tạo index cho expires_at để tối ưu truy vấn cleanup tokens hết hạn
    await queryInterface.addIndex("refresh_tokens", ["expires_at"], {
      name: "idx_refresh_tokens_expires",
    });

    // Tạo index cho revoked_at để tối ưu truy vấn tokens đã revoke
    await queryInterface.addIndex("refresh_tokens", ["revoked_at"], {
      name: "idx_refresh_tokens_revoked",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("refresh_tokens");
  },
};
