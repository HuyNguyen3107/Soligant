// src/pages/OrderFinalizePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import Loading from "../components/ui/Loading";
import {
  getOrderFromGoogleSheets,
  updateOrderStatusInGoogleSheets,
} from "../services/mockGoogleSheets";

const OrderFinalizePage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form data for finalization
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    deliveryMethod: "shipping",
    desiredDeliveryDate: "",
    shippingPayer: "customer",
    petInfo: "",
    cardMessage: "",
    frameColor: "natural",
    qrCodeLink: "",
    specialNotes: "",
  });

  useEffect(() => {
    const loadOrderData = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        const result = await getOrderFromGoogleSheets(orderId);
        if (result.success) {
          setOrderData(result.data);
          // Pre-fill some data from order
          setFormData((prev) => ({
            ...prev,
            recipientName: result.data.customerName,
            recipientPhone: result.data.customerPhone,
          }));
        } else {
          setError("Không tìm thấy đơn hàng hoặc đơn hàng đã được chốt");
        }
      } catch (err) {
        console.error("Error loading order:", err);
        setError("Có lỗi xảy ra khi tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.recipientName.trim()) {
      toast.warning("Vui lòng nhập tên người nhận");
      return;
    }

    setSubmitting(true);
    try {
      // Simulate moving order to PostgreSQL and updating status
      await updateOrderStatusInGoogleSheets(orderId, "Chờ xác nhận");

      // In real app, this would also save finalization data to PostgreSQL
      console.log("Order finalization data:", {
        orderId,
        ...formData,
        finalizedAt: new Date().toISOString(),
      });
      toast.success("Đã chốt đơn thành công! Đơn hàng đang chờ xác nhận.");

      // Show success modal instead of navigating
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error finalizing order:", error);
      toast.error("Có lỗi xảy ra khi chốt đơn");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loading size="large" />
          <p className="mt-4 font-utm-avo">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4 font-utm-avo">
            Đã xảy ra lỗi
          </h2>
          <p className="mb-6 font-utm-avo">{error}</p>
          <Button variant="primary" onClick={() => navigate("/order-search")}>
            Quay lại tìm kiếm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h1
          className="text-3xl md:text-4xl font-utm-avo text-soligant-primary text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Chốt đơn hàng
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 sticky top-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-bold mb-4 font-utm-avo">
                Thông tin đơn hàng
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Mã đơn:</span> #
                  {orderData?.orderId}
                </div>
                <div>
                  <span className="font-medium">Khách hàng:</span>{" "}
                  {orderData?.customerName}
                </div>
                <div>
                  <span className="font-medium">SĐT:</span>{" "}
                  {orderData?.customerPhone}
                </div>
                <div>
                  <span className="font-medium">Phiên bản:</span>{" "}
                  {orderData?.version}
                </div>
                <div className="border-t pt-3">
                  <span className="font-medium">Tổng tiền:</span>
                  <span className="text-lg font-bold text-soligant-primary ml-2">
                    {new Intl.NumberFormat("vi-VN").format(
                      orderData?.totalPrice || 0
                    )}{" "}
                    VNĐ
                  </span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-utm-avo">
                  💡 Sau khi chốt đơn, thông tin sẽ không thể chỉnh sửa. Đơn
                  hàng sẽ chuyển sang trạng thái "Chờ thanh toán".
                </p>
              </div>
            </motion.div>
          </div>

          {/* Finalization Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-bold mb-6 font-utm-avo">
                Thông tin giao hàng
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Họ tên người nhận *"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ tên người nhận"
                    required
                  />
                </div>

                {/* Delivery Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình thức nhận hàng *
                    </label>
                    <select
                      name="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary"
                      required
                    >
                      <option value="shipping">Giao hàng tận nơi</option>
                      <option value="pickup">Tự đến lấy</option>
                    </select>
                  </div>

                  <FormInput
                    label="Thời gian nhận mong muốn"
                    name="desiredDeliveryDate"
                    type="date"
                    value={formData.desiredDeliveryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Người trả phí ship
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="shippingPayer"
                        value="customer"
                        checked={formData.shippingPayer === "customer"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Khách hàng trả
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="shippingPayer"
                        value="shop"
                        checked={formData.shippingPayer === "shop"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Shop trả
                    </label>
                  </div>
                </div>

                {/* Additional Information */}
                <FormInput
                  label="Thông tin thú cưng (nếu có)"
                  name="petInfo"
                  value={formData.petInfo}
                  onChange={handleInputChange}
                  placeholder="VD: Mèo cái, lông vàng, tên Mimi"
                  isTextarea
                  rows={2}
                />

                <FormInput
                  label="Nội dung thiệp"
                  name="cardMessage"
                  value={formData.cardMessage}
                  onChange={handleInputChange}
                  placeholder="Nhập lời nhắn muốn ghi trên thiệp (tối đa 100 ký tự)"
                  maxLength={100}
                  isTextarea
                  rows={3}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu khung tranh
                    </label>
                    <select
                      name="frameColor"
                      value={formData.frameColor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-soligant-primary"
                    >
                      <option value="natural">Màu gỗ tự nhiên</option>
                      <option value="white">Màu trắng</option>
                      <option value="black">Màu đen</option>
                      <option value="brown">Màu nâu</option>
                    </select>
                  </div>

                  <FormInput
                    label="Link QR code (nếu có)"
                    name="qrCodeLink"
                    value={formData.qrCodeLink}
                    onChange={handleInputChange}
                    placeholder="Nhập link QR code"
                  />
                </div>

                <FormInput
                  label="Ghi chú hoặc lưu ý đặc biệt"
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleInputChange}
                  placeholder="Các yêu cầu đặc biệt khác..."
                  isTextarea
                  rows={3}
                />

                {/* Submit Button */}
                <div className="flex justify-center space-x-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/order-search")}
                    disabled={submitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    className="px-8"
                  >
                    {submitting ? <Loading size="small" /> : "Chốt đơn"}
                  </Button>
                </div>
              </form>
            </motion.div>{" "}
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-center">
                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-utm-avo">
                  Chốt đơn thành công!
                </h3>

                {/* Message */}
                <div className="text-gray-600 mb-6 font-utm-avo">
                  <p className="mb-2">
                    Đơn hàng <span className="font-semibold">#{orderId}</span>{" "}
                    đã được chốt thành công.
                  </p>
                  <p className="mb-2">
                    Đơn hàng hiện đang{" "}
                    <span className="font-semibold text-orange-600">
                      chờ xác nhận
                    </span>{" "}
                    từ phía admin.
                  </p>
                  <p className="text-sm text-gray-500">
                    Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác
                    nhận đơn hàng và hướng dẫn thanh toán.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/order-search")}
                    className="flex-1"
                  >
                    Tìm kiếm đơn hàng
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/")}
                    className="flex-1"
                  >
                    Về trang chủ
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-utm-avo">
                    Có thắc mắc? Liên hệ với chúng tôi qua Facebook hoặc
                    Instagram
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderFinalizePage;
