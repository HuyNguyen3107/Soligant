"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
      },
      order_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      // Người đặt mua
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      customer_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      customer_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      customer_facebook: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      customer_instagram: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      // Người nhận
      recipient_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      recipient_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      recipient_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      // Thời gian & Phương thức giao hàng
      delivery_method: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      desired_delivery_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      shipping_payer: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      // Thông tin đơn hàng
      collection_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "collections",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "pending_payment",
      },
      is_urgent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      subtotal_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      // Thông tin bổ sung
      has_pet: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      card_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      special_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      // Quản lý đơn hàng
      assigned_employee_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      finalized_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Tạo index cho order_number (unique)
    await queryInterface.addIndex("orders", ["order_number"], {
      name: "idx_orders_number",
      unique: true,
    });

    // Tạo index cho customer_phone
    await queryInterface.addIndex("orders", ["customer_phone"], {
      name: "idx_orders_cust_phone",
    });

    // Tạo index cho recipient_phone
    await queryInterface.addIndex("orders", ["recipient_phone"], {
      name: "idx_orders_recip_phone",
    });

    // Tạo index cho customer_name
    await queryInterface.addIndex("orders", ["customer_name"], {
      name: "idx_orders_cust_name",
    });

    // Tạo index cho recipient_name
    await queryInterface.addIndex("orders", ["recipient_name"], {
      name: "idx_orders_recip_name",
    });

    // Tạo index cho status
    await queryInterface.addIndex("orders", ["status"], {
      name: "idx_orders_status",
    });

    // Tạo index cho desired_delivery_date
    await queryInterface.addIndex("orders", ["desired_delivery_date"], {
      name: "idx_orders_delivery_date",
    });

    // Tạo index cho assigned_employee_id
    await queryInterface.addIndex("orders", ["assigned_employee_id"], {
      name: "idx_orders_employee",
    });

    // Tạo index cho collection_id
    await queryInterface.addIndex("orders", ["collection_id"], {
      name: "idx_orders_collection",
    });

    // Tạo index cho created_at
    await queryInterface.addIndex("orders", ["created_at"], {
      name: "idx_orders_created",
    });

    // Tạo index cho is_urgent
    await queryInterface.addIndex("orders", ["is_urgent"], {
      name: "idx_orders_urgent",
    });

    // Tạo index cho finalized_at
    await queryInterface.addIndex("orders", ["finalized_at"], {
      name: "idx_orders_finalized",
    });

    // Tạo index cho completed_at
    await queryInterface.addIndex("orders", ["completed_at"], {
      name: "idx_orders_completed",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
