// src/pages/InventoryTestPage.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import InventoryStatus from "../components/inventory/InventoryStatus";
import InventoryDashboard from "../components/admin/InventoryDashboard";
import { useInventory } from "../hooks/useInventory";

const InventoryTestPage = () => {
  const [userId, setUserId] = useState(
    "user-" + Math.random().toString(36).substr(2, 9)
  );
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);

  const { inventory, actions } = useInventory(userId);

  // Mẫu sản phẩm để test
  const sampleProducts = [
    {
      id: "version-1-single",
      name: "Version 1 - Single Character",
      quantity: 1,
    },
    { id: "version-2-couple", name: "Version 2 - Couple", quantity: 1 },
    { id: "lifestyle-combo", name: "Gói phụ kiện Lifestyle", quantity: 1 },
    { id: "wedding-premium", name: "Full Combo Wedding Premium", quantity: 1 },
  ];

  const handleAddItem = (product) => {
    const existing = selectedItems.find((item) => item.id === product.id);
    if (existing) {
      setSelectedItems((items) =>
        items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems((items) => [...items, { ...product }]);
    }
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems((items) => items.filter((item) => item.id !== productId));
  };

  const handleChangeQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setSelectedItems((items) =>
        items.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const generateNewUserId = () => {
    const newUserId = "user-" + Math.random().toString(36).substr(2, 9);
    setUserId(newUserId);
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Inventory Management Test
          </h1>
          <p className="text-gray-600">
            Test hệ thống quản lý inventory với reservation cho multiple users
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  👤 Khách hàng
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">User ID:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {userId}
                  </code>
                  <button
                    onClick={generateNewUserId}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    New User
                  </button>
                </div>
              </div>

              {/* Product Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Chọn sản phẩm:</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleProducts.map((product) => {
                    const stock = inventory
                      ? actions.getItemStock(product.id)
                      : 0;
                    const isAvailable = actions.isItemAvailable(product.id);

                    return (
                      <button
                        key={product.id}
                        onClick={() => handleAddItem(product)}
                        disabled={!isAvailable}
                        className={`
                          p-3 rounded-lg text-left text-sm transition-colors
                          ${
                            isAvailable
                              ? "bg-green-50 border border-green-200 hover:bg-green-100 text-green-800"
                              : "bg-red-50 border border-red-200 text-red-600 cursor-not-allowed"
                          }
                        `}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs">
                          Còn lại: <span className="font-bold">{stock}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Items */}
                {selectedItems.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Sản phẩm đã chọn:
                    </h4>
                    <div className="space-y-2">
                      {selectedItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span className="text-sm">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleChangeQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleChangeQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 text-xs ml-2 hover:text-red-800"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📦 Trạng thái Inventory
              </h3>
              <InventoryStatus
                userId={userId}
                selectedItems={selectedItems}
                onItemsChange={setSelectedItems}
              />
            </div>
          </div>

          {/* Admin Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                ⚙️ Admin Dashboard
              </h2>
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showAdmin
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {showAdmin ? "Ẩn Admin Panel" : "Hiển thị Admin Panel"}
              </button>
            </div>

            {showAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <InventoryDashboard />
              </motion.div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">
            📋 Hướng dẫn test:
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              1. <strong>Chọn sản phẩm</strong> bằng cách click vào các nút sản
              phẩm
            </p>
            <p>
              2. <strong>Đặt chỗ sản phẩm</strong> bằng nút "🔒 Đặt chỗ sản
              phẩm"
            </p>
            <p>
              3. <strong>Mở nhiều tab</strong> hoặc tạo "New User" để test
              multiple users
            </p>
            <p>
              4. <strong>Xem Admin Panel</strong> để theo dõi inventory
              real-time
            </p>
            <p>
              5. <strong>Đợi 15 phút</strong> hoặc "Hủy đặt chỗ" để release
              reservation
            </p>
            <p>
              6. <strong>Test hết hàng</strong> bằng cách đặt chỗ nhiều sản phẩm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTestPage;
