// src/pages/OrderSuccessPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"; // Add this import

// Components
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

// Mock service
import { getOrderFromGoogleSheets } from "../services/mockGoogleSheets";
import { resetCustomization } from "../redux/features/customizationSlice"; // Add this import

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch order data on component mount
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        const result = await getOrderFromGoogleSheets(orderId);

        if (result.success) {
          setOrderData(result.data);
        } else {
          setError("Không tìm thấy thông tin đơn hàng");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Có lỗi xảy ra khi tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  // Animate variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const bounceIn = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loading size="large" />
          <p className="mt-4 font-utm-avo text-gray-600">
            Đang tải thông tin đơn hàng...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4 font-utm-avo">
              Có lỗi xảy ra
            </h1>
            <p className="text-gray-600 mb-6 font-utm-avo">{error}</p>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Về trang chủ
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/collections")}
                className="w-full"
              >
                Xem bộ sưu tập
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="text-center mb-8"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          {/* Success Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-green-500 text-white rounded-full mb-6"
            variants={bounceIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-utm-avo text-soligant-primary mb-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            🎉 Đặt hàng thành công!
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-2 font-utm-avo"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Cảm ơn bạn đã lựa chọn SOLIGANT
          </motion.p>

          <motion.p
            className="text-sm text-gray-500 font-utm-avo"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Mã đơn hàng:{" "}
            <span className="font-bold text-soligant-primary">{orderId}</span>
          </motion.p>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 font-utm-avo text-soligant-primary">
              📋 Thông tin đơn hàng
            </h2>

            {orderData && (
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2 font-utm-avo">
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Tên:</span>{" "}
                      {orderData.customer.customerName}
                    </p>
                    <p>
                      <span className="font-medium">SĐT:</span>{" "}
                      {orderData.customer.customerPhone}
                    </p>
                    {orderData.customer.customerFacebook && (
                      <p>
                        <span className="font-medium">Facebook:</span>
                        <a
                          href={orderData.customer.customerFacebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          {orderData.customer.customerFacebook}
                        </a>
                      </p>
                    )}
                    {orderData.customer.customerInstagram && (
                      <p>
                        <span className="font-medium">Instagram:</span>
                        <a
                          href={orderData.customer.customerInstagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800 ml-1"
                        >
                          {orderData.customer.customerInstagram}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                {/* Order Status */}{" "}
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2 font-utm-avo">
                    Trạng thái đơn hàng
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      🕒 Chờ demo
                    </span>
                    {orderData.isUrgent && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        ⚡ Gấp
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      📦 Đơn hàng mới
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Chúng tôi đã nhận được đơn hàng của bạn và sẽ liên hệ sớm để
                    xác nhận thông tin chi tiết.
                  </p>
                </div>
                {/* Product Info */}
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2 font-utm-avo">
                    Sản phẩm đã chọn
                  </h3>
                  <div className="space-y-2 text-sm">
                    {" "}
                    {orderData.customization.version?.selected &&
                      !orderData.customization.fullCombo && (
                        <p>
                          <span className="font-medium">Phiên bản:</span>{" "}
                          {typeof orderData.customization.version.selected ===
                          "string"
                            ? orderData.customization.version.selected ===
                              "version1"
                              ? "Version 1 - Khung tranh có 01 LEGO-nhân"
                              : "Version 2 - Khung tranh có 02 LEGO-nhân"
                            : orderData.customization.version.selected.name}
                          <span className="ml-2 text-soligant-primary">
                            (
                            {new Intl.NumberFormat("vi-VN").format(
                              typeof orderData.customization.version
                                .selected === "string"
                                ? orderData.customization.version.selected ===
                                  "version1"
                                  ? 245000
                                  : 250000
                                : orderData.customization.version.selected
                                    .price || 0
                            )}{" "}
                            VNĐ)
                          </span>
                        </p>
                      )}{" "}
                    {orderData.customization.fullCombo && (
                      <div>
                        <p className="mb-1">
                          <span className="font-medium">💎 Combo:</span>{" "}
                          {orderData.customization.fullCombo.name}
                          {orderData.customization.fullCombo.price && (
                            <span className="ml-2 text-green-700">
                              (
                              {new Intl.NumberFormat("vi-VN").format(
                                orderData.customization.fullCombo.price
                              )}{" "}
                              VNĐ)
                            </span>
                          )}
                        </p>
                        {orderData.customization.fullCombo.includesText && (
                          <p className="text-xs text-gray-600 mb-1 ml-4">
                            Bao gồm:{" "}
                            {orderData.customization.fullCombo.includesText}
                          </p>
                        )}
                        {orderData.customization.fullCombo.includes
                          ?.version && (
                          <p className="text-xs text-gray-600 mb-1 ml-4">
                            Phiên bản:{" "}
                            {orderData.customization.fullCombo.includes
                              .version === "version1"
                              ? "Version 1 - Khung tranh có 01 LEGO-nhân"
                              : "Version 2 - Khung tranh có 02 LEGO-nhân"}
                          </p>
                        )}
                      </div>
                    )}
                    {orderData.customization.accessoryCombo && (
                      <p>
                        <span className="font-medium">Combo Phụ kiện:</span>{" "}
                        {orderData.customization.accessoryCombo.name}
                        {orderData.customization.accessoryCombo.price && (
                          <span className="ml-2 text-blue-600">
                            (
                            {new Intl.NumberFormat("vi-VN").format(
                              orderData.customization.accessoryCombo.price
                            )}{" "}
                            VNĐ)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                {/* Character Details */}
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2 font-utm-avo">
                    Tùy chỉnh nhân vật
                  </h3>

                  {/* Character 1 */}
                  <div className="mb-2">
                    <p className="font-medium mb-1">Nhân vật 1:</p>
                    <div className="flex flex-wrap gap-2">
                      {orderData.customization.characters.character1
                        .topColor && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Áo:{" "}
                          {
                            orderData.customization.characters.character1
                              .topColor.name
                          }
                        </span>
                      )}
                      {orderData.customization.characters.character1
                        .bottomColor && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Quần:{" "}
                          {
                            orderData.customization.characters.character1
                              .bottomColor.name
                          }
                        </span>
                      )}
                      {orderData.customization.characters.character1.face && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Mặt:{" "}
                          {
                            orderData.customization.characters.character1.face
                              .name
                          }
                        </span>
                      )}
                      {orderData.customization.characters.character1.hair && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Tóc:{" "}
                          {
                            orderData.customization.characters.character1.hair
                              .name
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Character 2 */}
                  {(orderData.customization.version?.selected?.name ===
                    "Version 2" ||
                    orderData.customization.fullCombo?.includes?.version ===
                      "version2") && (
                    <div className="mb-2">
                      <p className="font-medium mb-1">Nhân vật 2:</p>
                      <div className="flex flex-wrap gap-2">
                        {orderData.customization.characters.character2
                          .topColor && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Áo:{" "}
                            {
                              orderData.customization.characters.character2
                                .topColor.name
                            }
                          </span>
                        )}
                        {orderData.customization.characters.character2
                          .bottomColor && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Quần:{" "}
                            {
                              orderData.customization.characters.character2
                                .bottomColor.name
                            }
                          </span>
                        )}
                        {orderData.customization.characters.character2.face && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Mặt:{" "}
                            {
                              orderData.customization.characters.character2.face
                                .name
                            }
                          </span>
                        )}
                        {orderData.customization.characters.character2.hair && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Tóc:{" "}
                            {
                              orderData.customization.characters.character2.hair
                                .name
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional accessories */}
                  {Array.isArray(
                    orderData.customization.additionalAccessories
                  ) &&
                    orderData.customization.additionalAccessories.length >
                      0 && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">Phụ kiện thêm:</p>
                        <div className="flex flex-wrap gap-2">
                          {orderData.customization.additionalAccessories.map(
                            (acc, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-blue-50 px-2 py-1 rounded"
                              >
                                {acc.name}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Pet */}
                  {orderData.customization.additionalPet && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Thú cưng:</p>
                      <span className="text-xs bg-green-50 px-2 py-1 rounded">
                        {orderData.customization.additionalPet.name}
                      </span>
                    </div>
                  )}
                </div>
                {/* Background Details */}
                {orderData.customization.background?.template && (
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-lg mb-2 font-utm-avo">
                      Background
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Mẫu:</span>{" "}
                        {orderData.customization.background.template.name}
                      </p>
                      {orderData.customization.background.title && (
                        <p>
                          <span className="font-medium">Tiêu đề:</span>{" "}
                          {orderData.customization.background.title}
                        </p>
                      )}
                      {orderData.customization.background.name && (
                        <p>
                          <span className="font-medium">Tên:</span>{" "}
                          {orderData.customization.background.name}
                        </p>
                      )}
                      {orderData.customization.background.date && (
                        <p>
                          <span className="font-medium">Ngày:</span>{" "}
                          {orderData.customization.background.date}
                        </p>
                      )}
                      {orderData.customization.background.song && (
                        <p>
                          <span className="font-medium">Bài hát:</span>{" "}
                          {orderData.customization.background.song}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {/* Price */}
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-2 font-utm-avo">
                    Thông tin giá
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">
                        Tổng cộng:
                      </span>
                      <span className="text-xl font-bold text-soligant-primary">
                        {new Intl.NumberFormat("vi-VN").format(
                          orderData.totalPrice || 0
                        )}{" "}
                        VNĐ
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Thanh toán khi nhận hàng (COD) hoặc chuyển khoản theo
                      hướng dẫn
                    </p>
                  </div>
                </div>
                {/* Timestamp */}
                <div className="text-xs text-gray-500 pt-4">
                  <p>
                    Đơn hàng được tạo:{" "}
                    {new Date(orderData.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Next Steps */}
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 font-utm-avo text-soligant-primary">
              🔄 Bước tiếp theo
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 font-utm-avo">
                    Liên hệ tư vấn
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Chúng tôi sẽ liên hệ qua Facebook/Instagram trong vòng 24h
                    để tư vấn chi tiết về sản phẩm
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 font-utm-avo">
                    Gửi demo sản phẩm
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Sau khi tư vấn, chúng tôi sẽ tạo demo 3D sản phẩm theo yêu
                    cầu của bạn
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 font-utm-avo">
                    Xác nhận & thanh toán
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Bạn xem demo, xác nhận và thanh toán 100% để bắt đầu sản
                    xuất
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 font-utm-avo">
                    Sản xuất & giao hàng
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {orderData?.isUrgent
                      ? "Thời gian sản xuất: 3-5 ngày"
                      : "Thời gian sản xuất: 5-7 ngày"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2 font-utm-avo text-blue-800">
                📞 Liên hệ hỗ trợ
              </h3>
              <div className="space-y-1 text-sm text-blue-700">
                <p>
                  <span className="font-medium">Hotline:</span> 0123.456.789
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  support@soligant.com
                </p>
                <p>
                  <span className="font-medium">Facebook:</span>{" "}
                  facebook.com/soligant
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="text-center mt-8 space-y-4"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Về trang chủ
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(resetCustomization()); // Reset customization state
                navigate("/collections");
              }}
              className="flex-1"
            >
              Đặt thêm đơn khác
            </Button>
          </div>

          {/* Order tracking info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
            <h4 className="font-bold text-yellow-800 mb-2 font-utm-avo">
              💡 Ghi chú quan trọng
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>
                • Vui lòng lưu lại mã đơn hàng: <strong>{orderId}</strong>
              </li>
              <li>
                • Kiểm tra Facebook/Instagram thường xuyên để nhận tin nhắn từ
                chúng tôi
              </li>
              <li>
                • Đơn hàng có thể bị hủy nếu không liên lạc được trong 7 ngày
              </li>
              <li>
                • Mọi thắc mắc vui lòng liên hệ hotline hoặc gửi tin nhắn qua
                social media
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
