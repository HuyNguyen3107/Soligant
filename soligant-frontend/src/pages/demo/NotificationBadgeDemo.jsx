import React, { useState } from "react";
import NotificationBadge from "../ui/NotificationBadge";
import {
  BellIcon,
  UserIcon,
  ShoppingCartIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

const NotificationBadgeDemo = () => {
  const [counts, setCounts] = useState({
    basic: 5,
    medium: 25,
    large: 150,
    huge: 2500,
  });

  const updateCount = (key, value) => {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎯 NotificationBadge Component Demo
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🎛️ Điều Khiển</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(counts).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key}: {value}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={value}
                  onChange={(e) => updateCount(key, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex space-x-1">
                  <button
                    onClick={() => updateCount(key, 0)}
                    className="px-2 py-1 text-xs bg-gray-200 rounded"
                  >
                    0
                  </button>
                  <button
                    onClick={() => updateCount(key, 99)}
                    className="px-2 py-1 text-xs bg-gray-200 rounded"
                  >
                    99
                  </button>
                  <button
                    onClick={() => updateCount(key, 999)}
                    className="px-2 py-1 text-xs bg-gray-200 rounded"
                  >
                    999
                  </button>
                  <button
                    onClick={() => updateCount(key, 9999)}
                    className="px-2 py-1 text-xs bg-gray-200 rounded"
                  >
                    9999
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Size Demonstrations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📏 Kích Thước Tự Động</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.basic} />
              </div>
              <p className="text-sm text-gray-600">1-9: Badge nhỏ</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.medium} />
              </div>
              <p className="text-sm text-gray-600">10-99: Badge vừa</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.large} />
              </div>
              <p className="text-sm text-gray-600">100-999: Badge lớn</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.huge} />
              </div>
              <p className="text-sm text-gray-600">1000+: Badge rất lớn</p>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🎨 Variants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.medium} variant="danger" />
              </div>
              <p className="text-sm text-gray-600">Danger (Default)</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.medium} variant="primary" />
              </div>
              <p className="text-sm text-gray-600">Primary</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.medium} variant="success" />
              </div>
              <p className="text-sm text-gray-600">Success</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.medium} variant="warning" />
              </div>
              <p className="text-sm text-gray-600">Warning</p>
            </div>
          </div>
        </div>

        {/* Positions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📍 Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-16 w-16 text-gray-400" />
                <NotificationBadge count={counts.basic} position="top-right" />
              </div>
              <p className="text-sm text-gray-600">Top Right (Default)</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-16 w-16 text-gray-400" />
                <NotificationBadge count={counts.basic} position="top-left" />
              </div>
              <p className="text-sm text-gray-600">Top Left</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.basic} position="inline" />
              </div>
              <p className="text-sm text-gray-600">Inline</p>
            </div>
          </div>
        </div>

        {/* Animation */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">⚡ Animation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.medium} animate={true} />
              </div>
              <p className="text-sm text-gray-600">With Animation (Default)</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <BellIcon className="h-12 w-12 text-gray-400" />
                <NotificationBadge count={counts.medium} animate={false} />
              </div>
              <p className="text-sm text-gray-600">Without Animation</p>
            </div>
          </div>
        </div>

        {/* Real Use Cases */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🎯 Trường Hợp Thực Tế</h2>
          <div className="space-y-6">
            {/* Navigation Bar */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Navigation Bar
              </h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <BellIcon className="h-6 w-6 text-gray-600" />
                  <NotificationBadge count={counts.basic} />
                </div>
                <div className="relative">
                  <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
                  <NotificationBadge count={counts.medium} variant="primary" />
                </div>
                <div className="relative">
                  <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
                  <NotificationBadge count={counts.large} variant="success" />
                </div>
              </div>
            </div>

            {/* Sidebar Menu */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Sidebar Menu
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">Đơn hàng mới</span>
                  </div>
                  <NotificationBadge
                    count={counts.basic}
                    position="inline"
                    animate={false}
                  />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <ShoppingCartIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">Đơn hàng của tôi</span>
                  </div>
                  <NotificationBadge
                    count={counts.medium}
                    position="inline"
                    animate={false}
                    variant="primary"
                  />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">Tin nhắn</span>
                  </div>
                  <NotificationBadge
                    count={counts.large}
                    position="inline"
                    animate={false}
                    variant="warning"
                  />
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Dashboard Cards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium">Thông báo mới</h4>
                  <p className="text-2xl font-bold mt-2">{counts.basic}</p>
                  <NotificationBadge count={counts.basic} />
                </div>
                <div className="relative bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium">Đơn hàng chờ</h4>
                  <p className="text-2xl font-bold mt-2">{counts.medium}</p>
                  <NotificationBadge count={counts.medium} variant="warning" />
                </div>
                <div className="relative bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium">Hoàn thành</h4>
                  <p className="text-2xl font-bold mt-2">{counts.large}</p>
                  <NotificationBadge count={counts.large} variant="success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">⚡ Performance Test</h2>
          <p className="text-sm text-gray-600 mb-4">
            100 badges để test performance:
          </p>
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="relative">
                <BellIcon className="h-6 w-6 text-gray-300" />
                <NotificationBadge
                  count={Math.floor(Math.random() * 1000) + 1}
                  animate={false}
                  variant={
                    ["danger", "primary", "success", "warning"][
                      Math.floor(Math.random() * 4)
                    ]
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBadgeDemo;
