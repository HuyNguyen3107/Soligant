// src/hooks/useRealtimeNotifications.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrderNotification,
  addNotification,
  selectNotificationSettings,
} from "../redux/features/notificationSlice";
import { addNewOrder } from "../redux/features/orderManagementSlice";

// Mock data cho demo
const mockCustomers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@email.com",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0987654321",
    email: "tranthib@email.com",
  },
  {
    id: 3,
    name: "Lê Hoàng C",
    phone: "0369852147",
    email: "lehoangc@email.com",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0147258369",
    email: "phamthid@email.com",
  },
  { id: 5, name: "Võ Văn E", phone: "0258147963", email: "vovane@email.com" },
];

const mockProducts = [
  { name: "Version 1 (Cơ bản)", price: 245000 },
  { name: "Version 2 (Nâng cao)", price: 345000 },
  { name: "Version 3 (Premium)", price: 445000 },
];

const generateOrderCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "SO-";

  // Add 4 random numbers
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return result;
};

const generateMockOrder = () => {
  const customer =
    mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
  const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items
  const total = product.price * quantity;

  return {
    order: {
      id: `order-${Date.now()}`,
      code: generateOrderCode(),
      total: total,
      quantity: quantity,
      productName: product.name,
      createdAt: new Date().toISOString(),
      status: "pending",
    },
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    },
  };
};

const useRealtimeNotifications = () => {
  const dispatch = useDispatch();
  const { isEnabled } = useSelector(selectNotificationSettings);

  useEffect(() => {
    if (!isEnabled) return; // Simulate new order notifications every 30-60 seconds
    const orderInterval = setInterval(() => {
      const mockData = generateMockOrder();

      // Add notification
      dispatch(addOrderNotification(mockData));

      // Also add to order management system (available for assignment)
      dispatch(addNewOrder(mockData));
    }, Math.random() * 30000 + 30000); // 30-60 seconds

    // Simulate other notifications every 60-120 seconds
    const generalInterval = setInterval(() => {
      const generalNotifications = [
        {
          type: "payment",
          title: "Thanh toán thành công",
          message: `Đơn hàng ${generateOrderCode()} đã được thanh toán`,
          priority: "normal",
        },
        {
          type: "shipping",
          title: "Đơn hàng đã giao",
          message: `Đơn hàng ${generateOrderCode()} đã giao thành công`,
          priority: "normal",
        },
        {
          type: "review",
          title: "Đánh giá mới",
          message: `Khách hàng ${
            mockCustomers[Math.floor(Math.random() * mockCustomers.length)].name
          } đã đánh giá 5 sao`,
          priority: "low",
        },
        {
          type: "inventory",
          title: "Cảnh báo tồn kho",
          message: `Sản phẩm ${
            mockProducts[Math.floor(Math.random() * mockProducts.length)].name
          } sắp hết hàng`,
          priority: "high",
        },
      ];

      const randomNotification =
        generalNotifications[
          Math.floor(Math.random() * generalNotifications.length)
        ];
      dispatch(addNotification(randomNotification));
    }, Math.random() * 60000 + 60000); // 60-120 seconds

    return () => {
      clearInterval(orderInterval);
      clearInterval(generalInterval);
    };
  }, [dispatch, isEnabled]);
  // Function to manually trigger a test notification (for development)
  const triggerTestOrderNotification = () => {
    const mockData = generateMockOrder();
    dispatch(addOrderNotification(mockData));
    dispatch(addNewOrder(mockData));
  };

  const triggerTestGeneralNotification = () => {
    dispatch(
      addNotification({
        type: "info",
        title: "Test Notification",
        message: "This is a test notification",
        priority: "normal",
      })
    );
  };

  return {
    triggerTestOrderNotification,
    triggerTestGeneralNotification,
  };
};

export default useRealtimeNotifications;
