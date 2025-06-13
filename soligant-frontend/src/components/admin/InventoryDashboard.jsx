// src/components/admin/InventoryDashboard.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import { useInventoryStats } from "../../hooks/useInventory";
import { resetInventory } from "../../services/inventoryService";

const InventoryDashboard = () => {
  const { stats, loading, reload } = useInventoryStats();
  const [showDetails, setShowDetails] = useState(false);

  const handleResetInventory = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn reset inventory về trạng thái ban đầu?"
      )
    ) {
      resetInventory();
      reload();
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-soligant-primary"></div>
        <span className="ml-3 text-gray-600">
          Đang tải thống kê inventory...
        </span>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          📦 Inventory Dashboard
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}
          </button>
          <button
            onClick={reload}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            🔄 Làm mới
          </button>
          <button
            onClick={handleResetInventory}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalReservations}
          </div>
          <div className="text-sm text-blue-800">Đang đặt chỗ</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {stats.reservedItems}
          </div>
          <div className="text-sm text-orange-800">Sản phẩm được đặt chỗ</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {Object.values(stats.realInventory.products || {}).reduce(
              (sum, p) => sum + p.stock,
              0
            )}
          </div>
          <div className="text-sm text-green-800">Tổng sản phẩm thật</div>
        </div>
      </div>

      {/* Real vs Reservation Inventory Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Inventory */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            🏪 Inventory Thật
          </h3>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Sản phẩm chính:
              </h4>
              <div className="space-y-1">
                {Object.values(stats.realInventory.products || {}).map(
                  (product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600">{product.name}</span>
                      <span
                        className={`font-medium ${
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Phụ kiện:</h4>
              <div className="space-y-1">
                {Object.values(stats.realInventory.accessories || {}).map(
                  (accessory) => (
                    <div
                      key={accessory.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600">{accessory.name}</span>
                      <span
                        className={`font-medium ${
                          accessory.stock > 10
                            ? "text-green-600"
                            : accessory.stock > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {accessory.stock}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Full Combo:</h4>
              <div className="space-y-1">
                {Object.values(stats.realInventory.fullCombos || {}).map(
                  (combo) => (
                    <div
                      key={combo.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600">{combo.name}</span>
                      <span
                        className={`font-medium ${
                          combo.stock > 10
                            ? "text-green-600"
                            : combo.stock > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {combo.stock}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Inventory */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            🔒 Inventory Đặt Chỗ
          </h3>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Sản phẩm chính:
              </h4>
              <div className="space-y-1">
                {Object.values(stats.reservationInventory.products || {}).map(
                  (product) => {
                    const realStock =
                      stats.realInventory.products[product.id]?.stock || 0;
                    const reserved = realStock - product.stock;

                    return (
                      <div
                        key={product.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">{product.name}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              product.stock > 10
                                ? "text-green-600"
                                : product.stock > 0
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                          {reserved > 0 && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">
                              -{reserved}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Phụ kiện:</h4>
              <div className="space-y-1">
                {Object.values(
                  stats.reservationInventory.accessories || {}
                ).map((accessory) => {
                  const realStock =
                    stats.realInventory.accessories[accessory.id]?.stock || 0;
                  const reserved = realStock - accessory.stock;

                  return (
                    <div
                      key={accessory.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600">{accessory.name}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            accessory.stock > 10
                              ? "text-green-600"
                              : accessory.stock > 0
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {accessory.stock}
                        </span>
                        {reserved > 0 && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">
                            -{reserved}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Full Combo:</h4>
              <div className="space-y-1">
                {Object.values(stats.reservationInventory.fullCombos || {}).map(
                  (combo) => {
                    const realStock =
                      stats.realInventory.fullCombos[combo.id]?.stock || 0;
                    const reserved = realStock - combo.stock;

                    return (
                      <div
                        key={combo.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">{combo.name}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              combo.stock > 10
                                ? "text-green-600"
                                : combo.stock > 0
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}
                          >
                            {combo.stock}
                          </span>
                          {reserved > 0 && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-1 rounded">
                              -{reserved}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Reservations */}
      {showDetails && stats.activeReservations?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            🔒 Các Đặt Chỗ Đang Hoạt Động
          </h3>

          <div className="space-y-2">
            {stats.activeReservations.map((reservation, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-blue-800">
                    User: {reservation.userId}
                  </span>
                  <span className="text-xs text-blue-600">
                    Hết hạn:{" "}
                    {new Date(reservation.expiresAt).toLocaleTimeString(
                      "vi-VN"
                    )}
                  </span>
                </div>

                <div className="space-y-1">
                  {reservation.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm text-blue-700">
                      • {item.name} x{item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InventoryDashboard;
