// src/pages/OrderSearchPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaTruck } from "react-icons/fa";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import Loading from "../components/ui/Loading";
import {
  searchOrdersInGoogleSheets,
  getOrderFromGoogleSheets,
} from "../services/mockGoogleSheets";

const OrderSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.warning("Vui lòng nhập tên hoặc số điện thoại");
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    try {
      const result = await searchOrdersInGoogleSheets(searchTerm);
      setSearchResults(result.results);
      setSelectedOrder(null);

      if (result.results.length === 0) {
        toast.info("Không tìm thấy đơn hàng nào");
      } else {
        toast.success(`Tìm thấy ${result.results.length} đơn hàng`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    setLoading(true);
    try {
      const result = await getOrderFromGoogleSheets(orderId);
      if (result.success) {
        setSelectedOrder(result.data);
      } else {
        toast.error("Không thể tải thông tin đơn hàng");
      }
    } catch (error) {
      console.error("Get order error:", error);
      toast.error("Có lỗi xảy ra khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = (trackingUrl) => {
    window.open(trackingUrl, "_blank");
  };

  const formatStatus = (status) => {
    const statusMap = {
      "Chờ demo": { text: "Chờ demo", color: "bg-yellow-100 text-yellow-800" },
      Pending: { text: "Pending", color: "bg-red-100 text-red-800" },
      "Chờ thanh toán": {
        text: "Chờ thanh toán",
        color: "bg-blue-100 text-blue-800",
      },
      "Đang xử lý": {
        text: "Đang xử lý",
        color: "bg-purple-100 text-purple-800",
      },
      "Đang vận chuyển": {
        text: "Đang vận chuyển",
        color: "bg-orange-100 text-orange-800",
      },
      "Hoàn thành": {
        text: "Hoàn thành",
        color: "bg-green-100 text-green-800",
      },
    };
    return (
      statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h1
          className="text-3xl md:text-4xl font-utm-avo text-soligant-primary text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tìm kiếm đơn hàng
        </motion.h1>{" "}
        {/* Search Form */}{" "}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <FormInput
                label="Tên khách hàng hoặc số điện thoại"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="VD: Nguyễn Văn A hoặc 0901234567"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex md:items-end md:pb-4">
              <Button
                variant="primary"
                onClick={handleSearch}
                disabled={loading}
                className="w-full md:w-auto px-6 py-2 h-[42px] items-center flex"
              >
                {loading ? "Loading..." : "Tìm kiếm"}
              </Button>
            </div>
          </div>
        </motion.div>
        {/* Search Results */}
        {searchPerformed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {searchResults.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 font-utm-avo">
                  Kết quả tìm kiếm ({searchResults.length} đơn hàng)
                </h2>
                <div className="space-y-4">
                  {searchResults.map((order) => {
                    const statusInfo = formatStatus(order.status);
                    return (
                      <div
                        key={order.orderId}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg font-utm-avo">
                              #{order.orderId}
                            </h3>
                            <p className="text-gray-600 font-utm-avo">
                              {order.customerName} - {order.customerPhone}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.text}
                          </span>
                        </div>{" "}
                        <div className="flex justify-between items-center">
                          <p className="text-gray-500 text-sm font-utm-avo">
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order.orderId)}
                            >
                              Xem chi tiết
                            </Button>
                            {(order.status === "Chờ demo" ||
                              order.status === "Pending") && (
                              <Link to={`/finalize-order/${order.orderId}`}>
                                <Button variant="success" size="sm">
                                  Chốt đơn
                                </Button>
                              </Link>
                            )}
                            <Link to={`/copy-order/${order.orderId}`}>
                              <Button variant="primary" size="sm">
                                Sao chép
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="mt-2">
                          {order.shippingInfo &&
                            order.shippingInfo.trackingNumber && (
                              <p className="text-sm text-gray-600">
                                Mã vận đơn: {order.shippingInfo.trackingNumber}
                              </p>
                            )}
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2">
                          {/* Conditional rendering for "Theo dõi đơn hàng" button */}
                          {(order.status === "Đang xử lý" ||
                            order.status === "Đang vận chuyển" ||
                            order.status === "Hoàn thành") &&
                            order.shippingInfo?.trackingUrl && (
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() =>
                                  handleTrackOrder(
                                    order.shippingInfo.trackingUrl
                                  )
                                }
                                className="w-full sm:w-auto"
                              >
                                <FaTruck className="mr-2" />
                                Theo dõi đơn hàng
                              </Button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <p className="text-gray-500 font-utm-avo">
                  Không tìm thấy đơn hàng nào với từ khóa "{searchTerm}"
                </p>
              </div>
            )}
          </motion.div>
        )}{" "}
        {/* Order Detail Modal */}
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold font-utm-avo text-soligant-primary">
                      Đơn hàng #{selectedOrder.orderId}
                    </h2>
                    <p className="text-gray-600 font-utm-avo text-sm">
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                      • {formatStatus(selectedOrder.status).text}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                </div>{" "}
                <div className="space-y-6">
                  {/* Header thông tin đơn hàng */}
                  <div className="text-center pb-4 border-b">
                    <h2 className="text-2xl font-bold font-utm-avo text-soligant-primary mb-2">
                      📋 Thông tin đơn hàng
                    </h2>
                    <p className="text-gray-600 font-utm-avo">
                      Mã đơn hàng: #{selectedOrder.orderId}
                    </p>
                  </div>
                  {/* Thông tin khách hàng */}
                  <div>
                    <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                      Thông tin khách hàng
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="font-utm-avo font-semibold">
                          Tên:{" "}
                        </span>
                        <span className="font-utm-avo">
                          {selectedOrder.customer?.customerName ||
                            selectedOrder.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="font-utm-avo font-semibold">
                          SĐT:{" "}
                        </span>
                        <span className="font-utm-avo">
                          {selectedOrder.customer?.customerPhone ||
                            selectedOrder.customerPhone}
                        </span>
                      </div>
                      {(selectedOrder.customer?.customerEmail ||
                        selectedOrder.customerEmail) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Email:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customer?.customerEmail ||
                              selectedOrder.customerEmail}
                          </span>
                        </div>
                      )}
                      {(selectedOrder.customer?.customerFacebook ||
                        selectedOrder.customerFacebook) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Facebook:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customer?.customerFacebook ||
                              selectedOrder.customerFacebook}
                          </span>
                        </div>
                      )}
                      {(selectedOrder.customer?.customerInstagram ||
                        selectedOrder.customerInstagram) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Instagram:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customer?.customerInstagram ||
                              selectedOrder.customerInstagram}
                          </span>
                        </div>
                      )}
                      {(selectedOrder.customer?.customerAddress ||
                        selectedOrder.customerAddress) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Địa chỉ:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customer?.customerAddress ||
                              selectedOrder.customerAddress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Trạng thái đơn hàng */}
                  <div>
                    <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                      Trạng thái đơn hàng
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {selectedOrder.status === "Chờ xác nhận"
                            ? "🕒"
                            : selectedOrder.status === "Chờ demo"
                            ? "🎨"
                            : selectedOrder.status === "Đang sản xuất"
                            ? "⚒️"
                            : selectedOrder.status === "Đang vận chuyển"
                            ? "🚚"
                            : selectedOrder.status === "Hoàn thành"
                            ? "✅"
                            : selectedOrder.status === "Đã giao"
                            ? "📦"
                            : "📋"}
                        </span>
                        <span className="font-utm-avo font-semibold text-lg">
                          {selectedOrder.status}
                        </span>
                      </div>
                      {selectedOrder.isUrgent && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⚡</span>
                          <span className="font-utm-avo font-semibold text-red-600">
                            Gấp
                          </span>
                        </div>
                      )}
                      <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-400">
                        <p className="font-utm-avo text-sm text-gray-700">
                          {selectedOrder.status === "Chờ xác nhận"
                            ? "Chúng tôi đã nhận được đơn hàng của bạn và sẽ liên hệ sớm để xác nhận thông tin chi tiết."
                            : selectedOrder.status === "Chờ demo"
                            ? "Đơn hàng đang chờ demo. Chúng tôi sẽ gửi hình ảnh mẫu để bạn xác nhận trước khi sản xuất."
                            : selectedOrder.status === "Đang sản xuất"
                            ? "Đơn hàng đang được sản xuất. Chúng tôi sẽ cập nhật tiến độ sớm nhất."
                            : selectedOrder.status === "Đang vận chuyển"
                            ? "Đơn hàng đang được vận chuyển đến địa chỉ của bạn."
                            : selectedOrder.status === "Hoàn thành"
                            ? "Đơn hàng đã hoàn thành và sẵn sàng giao hàng."
                            : selectedOrder.status === "Đã giao"
                            ? "Đơn hàng đã được giao thành công."
                            : "Đơn hàng đang được xử lý."}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Sản phẩm đã chọn */}
                  <div>
                    <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                      Sản phẩm đã chọn
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4 space-y-3">
                      {/* Version */}
                      <div>
                        <span className="font-utm-avo font-semibold">
                          Phiên bản:{" "}
                        </span>
                        <span className="font-utm-avo">
                          {selectedOrder.customization?.version?.selected
                            ?.name || selectedOrder.version}
                          {selectedOrder.customization?.version?.selected
                            ?.description &&
                            ` - ${selectedOrder.customization.version.selected.description}`}
                          <span className="text-green-600 font-bold">
                            (
                            {new Intl.NumberFormat("vi-VN").format(
                              selectedOrder.customization?.version?.selected
                                ?.price ||
                                selectedOrder.versionPrice ||
                                0
                            )}{" "}
                            VNĐ)
                          </span>
                        </span>
                      </div>{" "}
                      {/* Full Combo */}
                      {(selectedOrder.customization?.fullCombo ||
                        selectedOrder.fullCombo) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Full Combo:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customization?.fullCombo?.name ||
                              selectedOrder.fullCombo}
                            <span className="text-green-600 font-bold">
                              (
                              {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.customization?.fullCombo?.price ||
                                  selectedOrder.fullComboPrice ||
                                  0
                              )}{" "}
                              VNĐ)
                            </span>
                          </span>
                          {/* Danh sách món đồ trong Full Combo */}
                          <div className="ml-4 mt-2 text-sm text-gray-600">
                            <div className="font-utm-avo">Bao gồm:</div>
                            <div className="ml-2 space-y-1">
                              <div className="font-utm-avo">
                                • Tất cả phụ kiện cơ bản
                              </div>
                              <div className="font-utm-avo">
                                • Phụ kiện cao cấp
                              </div>
                              <div className="font-utm-avo">
                                • Background đặc biệt
                              </div>
                              <div className="font-utm-avo">
                                • Thú cưng miễn phí
                              </div>
                              <div className="font-utm-avo">
                                • Khung tranh cao cấp
                              </div>
                              <div className="font-utm-avo">
                                • Hộp quà sang trọng
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Accessory Combo */}
                      {(selectedOrder.customization?.accessoryCombo ||
                        selectedOrder.accessoryCombo) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Combo Phụ kiện:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customization?.accessoryCombo
                              ?.name || selectedOrder.accessoryCombo}
                            <span className="text-green-600 font-bold">
                              (
                              {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.customization?.accessoryCombo
                                  ?.price ||
                                  selectedOrder.accessoryComboPrice ||
                                  0
                              )}{" "}
                              VNĐ)
                            </span>
                          </span>
                          {/* Danh sách món đồ trong Accessory Combo */}
                          <div className="ml-4 mt-2 text-sm text-gray-600">
                            <div className="font-utm-avo">Bao gồm:</div>
                            <div className="ml-2 space-y-1">
                              {(selectedOrder.customization?.accessoryCombo
                                ?.name || selectedOrder.accessoryCombo) ===
                                "Gói phụ kiện Lifestyle" && (
                                <>
                                  <div className="font-utm-avo">
                                    • Kính mát thời trang
                                  </div>
                                  <div className="font-utm-avo">
                                    • Mũ baseball
                                  </div>
                                  <div className="font-utm-avo">
                                    • Túi xách mini
                                  </div>
                                  <div className="font-utm-avo">
                                    • Đồng hồ đeo tay
                                  </div>
                                </>
                              )}
                              {(selectedOrder.customization?.accessoryCombo
                                ?.name || selectedOrder.accessoryCombo) ===
                                "Gói phụ kiện Sáng tạo" && (
                                <>
                                  <div className="font-utm-avo">
                                    • Laptop mini
                                  </div>
                                  <div className="font-utm-avo">
                                    • Cây guitar
                                  </div>
                                  <div className="font-utm-avo">• Sách nhỏ</div>
                                  <div className="font-utm-avo">
                                    • Cây bút màu
                                  </div>
                                  <div className="font-utm-avo">
                                    • Ly cà phê
                                  </div>
                                </>
                              )}
                              {(selectedOrder.customization?.accessoryCombo
                                ?.name || selectedOrder.accessoryCombo) ===
                                "Gói phụ kiện Nghệ thuật" && (
                                <>
                                  <div className="font-utm-avo">
                                    • Bảng vẽ mini
                                  </div>
                                  <div className="font-utm-avo">• Cọ vẽ</div>
                                  <div className="font-utm-avo">
                                    • Hoa tulip
                                  </div>
                                  <div className="font-utm-avo">
                                    • Túi xách mini
                                  </div>
                                  <div className="font-utm-avo">
                                    • Camera mini
                                  </div>
                                </>
                              )}
                              {(selectedOrder.customization?.accessoryCombo
                                ?.name || selectedOrder.accessoryCombo) ===
                                "Gói phụ kiện Gaming Pro" && (
                                <>
                                  <div className="font-utm-avo">
                                    • Tai nghe gaming
                                  </div>
                                  <div className="font-utm-avo">
                                    • Bàn phím cơ mini
                                  </div>
                                  <div className="font-utm-avo">
                                    • Chuột gaming
                                  </div>
                                  <div className="font-utm-avo">
                                    • Màn hình mini
                                  </div>
                                  <div className="font-utm-avo">
                                    • Đèn LED RGB
                                  </div>
                                </>
                              )}
                              {![
                                "Gói phụ kiện Lifestyle",
                                "Gói phụ kiện Sáng tạo",
                                "Gói phụ kiện Nghệ thuật",
                                "Gói phụ kiện Gaming Pro",
                              ].includes(
                                selectedOrder.customization?.accessoryCombo
                                  ?.name || selectedOrder.accessoryCombo
                              ) && (
                                <>
                                  <div className="font-utm-avo">
                                    • Phụ kiện chủ đề
                                  </div>
                                  <div className="font-utm-avo">
                                    • Vật dụng trang trí
                                  </div>
                                  <div className="font-utm-avo">
                                    • Món đồ đặc biệt
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>{" "}
                  </div>{" "}
                  {/* Thông tin giá */}
                  <div>
                    <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                      Thông tin giá
                    </h3>
                    <div className="bg-emerald-50 rounded-lg p-4 space-y-3">
                      {/* Chi tiết giá */}
                      <div className="space-y-2">
                        {/* Version Price */}
                        {(selectedOrder.versionPrice ||
                          selectedOrder.customization?.version?.selected
                            ?.price) && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-utm-avo">
                              {selectedOrder.customization?.version?.selected
                                ?.name || selectedOrder.version}
                              :
                            </span>
                            <span className="font-utm-avo font-medium">
                              {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.versionPrice ||
                                  selectedOrder.customization?.version?.selected
                                    ?.price ||
                                  0
                              )}{" "}
                              VNĐ
                            </span>
                          </div>
                        )}

                        {/* Full Combo Price */}
                        {(selectedOrder.fullComboPrice ||
                          selectedOrder.customization?.fullCombo?.price) && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-utm-avo">
                              {selectedOrder.customization?.fullCombo?.name ||
                                selectedOrder.fullCombo}
                              :
                            </span>
                            <span className="font-utm-avo font-medium">
                              {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.fullComboPrice ||
                                  selectedOrder.customization?.fullCombo
                                    ?.price ||
                                  0
                              )}{" "}
                              VNĐ
                            </span>
                          </div>
                        )}

                        {/* Accessory Combo Price */}
                        {(selectedOrder.accessoryComboPrice ||
                          selectedOrder.customization?.accessoryCombo
                            ?.price) && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-utm-avo">
                              {selectedOrder.customization?.accessoryCombo
                                ?.name || selectedOrder.accessoryCombo}
                              :
                            </span>
                            <span className="font-utm-avo font-medium">
                              {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.accessoryComboPrice ||
                                  selectedOrder.customization?.accessoryCombo
                                    ?.price ||
                                  0
                              )}{" "}
                              VNĐ
                            </span>
                          </div>
                        )}

                        {/* Additional Accessories Price */}
                        {selectedOrder.additionalAccessoriesPrice && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-utm-avo">Phụ kiện thêm:</span>
                            <span className="font-utm-avo font-medium">
                              {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.additionalAccessoriesPrice
                              )}{" "}
                              VNĐ
                            </span>
                          </div>
                        )}

                        {/* Additional Pet Price */}
                        {selectedOrder.additionalPetPrice && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-utm-avo">Thú cưng:</span>
                            <span className="font-utm-avo font-medium">
                              {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.additionalPetPrice
                              )}{" "}
                              VNĐ
                            </span>
                          </div>
                        )}

                        {/* Shipping Fee */}
                        {selectedOrder.shippingFee !== undefined && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-utm-avo">
                              Phí vận chuyển:
                            </span>
                            <span className="font-utm-avo font-medium">
                              {selectedOrder.shippingFee === 0
                                ? "Miễn phí"
                                : `${new Intl.NumberFormat("vi-VN").format(
                                    selectedOrder.shippingFee
                                  )} VNĐ`}
                            </span>
                          </div>
                        )}

                        {/* Discount */}
                        {selectedOrder.discount && (
                          <div className="flex justify-between items-center text-sm text-red-600">
                            <span className="font-utm-avo">Giảm giá:</span>
                            <span className="font-utm-avo font-medium">
                              -
                              {new Intl.NumberFormat("vi-VN").format(
                                selectedOrder.discount
                              )}{" "}
                              VNĐ
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tổng tiền */}
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="font-utm-avo font-semibold text-lg">
                          💰 Tổng tiền:
                        </span>
                        <span className="font-utm-avo font-bold text-xl text-emerald-600">
                          {new Intl.NumberFormat("vi-VN").format(
                            selectedOrder.totalPrice ||
                              selectedOrder.totalAmount ||
                              0
                          )}{" "}
                          VNĐ
                        </span>
                      </div>

                      {/* Phương thức thanh toán */}
                      {selectedOrder.paymentMethod && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            💳 Phương thức thanh toán:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.paymentMethod === "bank_transfer"
                              ? "Chuyển khoản ngân hàng"
                              : selectedOrder.paymentMethod === "credit_card"
                              ? "Thẻ tín dụng"
                              : selectedOrder.paymentMethod === "cash"
                              ? "Tiền mặt"
                              : selectedOrder.paymentMethod === "momo"
                              ? "Ví MoMo"
                              : selectedOrder.paymentMethod === "zalopay"
                              ? "ZaloPay"
                              : selectedOrder.paymentMethod === "Chuyển khoản"
                              ? "Chuyển khoản ngân hàng"
                              : selectedOrder.paymentMethod}
                          </span>
                        </div>
                      )}

                      {/* Trạng thái thanh toán */}
                      {selectedOrder.paymentStatus && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            📊 Trạng thái thanh toán:{" "}
                          </span>
                          <span
                            className={`font-utm-avo font-medium ${
                              selectedOrder.paymentStatus === "paid" ||
                              selectedOrder.paymentStatus === "Paid"
                                ? "text-green-600"
                                : selectedOrder.paymentStatus === "pending" ||
                                  selectedOrder.paymentStatus === "Pending"
                                ? "text-yellow-600"
                                : selectedOrder.paymentStatus === "failed" ||
                                  selectedOrder.paymentStatus === "Failed"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {selectedOrder.paymentStatus === "paid" ||
                            selectedOrder.paymentStatus === "Paid"
                              ? "Đã thanh toán"
                              : selectedOrder.paymentStatus === "pending" ||
                                selectedOrder.paymentStatus === "Pending"
                              ? "Chờ thanh toán"
                              : selectedOrder.paymentStatus === "failed" ||
                                selectedOrder.paymentStatus === "Failed"
                              ? "Thanh toán thất bại"
                              : selectedOrder.paymentStatus}
                          </span>
                        </div>
                      )}

                      {/* Estimated Delivery */}
                      {selectedOrder.estimatedDelivery && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            🚚 Dự kiến giao hàng:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {new Date(
                              selectedOrder.estimatedDelivery
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}

                      {/* Ghi chú về giá */}
                      {(selectedOrder.priceNote ||
                        selectedOrder.customizationNotes) && (
                        <div className="mt-3 p-3 bg-white rounded border-l-4 border-emerald-400">
                          <span className="font-utm-avo font-semibold">
                            📝 Ghi chú:{" "}
                          </span>
                          <span className="font-utm-avo text-sm text-gray-700">
                            {selectedOrder.priceNote ||
                              selectedOrder.customizationNotes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Tùy chỉnh nhân vật */}
                  <div>
                    <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                      Tùy chỉnh nhân vật
                    </h3>
                    <div className="bg-yellow-50 rounded-lg p-4 space-y-4">
                      {/* Character 1 */}
                      {(selectedOrder.char1_topColor ||
                        selectedOrder.customization?.characters?.character1
                          ?.topColor) && (
                        <div>
                          <div className="font-utm-avo font-semibold mb-2">
                            Nhân vật 1:
                          </div>
                          <div className="ml-4 space-y-1">
                            {(selectedOrder.char1_topColor ||
                              selectedOrder.customization?.characters
                                ?.character1?.topColor?.name) && (
                              <div>
                                <span className="font-utm-avo">Áo: </span>
                                <span className="font-utm-avo">
                                  {selectedOrder.char1_topColor ||
                                    selectedOrder.customization.characters
                                      .character1.topColor.name}
                                </span>
                              </div>
                            )}
                            {(selectedOrder.char1_bottomColor ||
                              selectedOrder.customization?.characters
                                ?.character1?.bottomColor?.name) && (
                              <div>
                                <span className="font-utm-avo">Quần: </span>
                                <span className="font-utm-avo">
                                  {selectedOrder.char1_bottomColor ||
                                    selectedOrder.customization.characters
                                      .character1.bottomColor.name}
                                </span>
                              </div>
                            )}
                            {(selectedOrder.char1_face ||
                              selectedOrder.customization?.characters
                                ?.character1?.face?.name) && (
                              <div>
                                <span className="font-utm-avo">Mặt: </span>
                                <span className="font-utm-avo">
                                  {selectedOrder.char1_face ||
                                    selectedOrder.customization.characters
                                      .character1.face.name}
                                </span>
                              </div>
                            )}
                            {(selectedOrder.char1_hair ||
                              selectedOrder.customization?.characters
                                ?.character1?.hair?.name) && (
                              <div>
                                <span className="font-utm-avo">Tóc: </span>
                                <span className="font-utm-avo">
                                  {selectedOrder.char1_hair ||
                                    selectedOrder.customization.characters
                                      .character1.hair.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Character 2 */}
                      {(selectedOrder.char2_topColor ||
                        selectedOrder.customization?.characters?.character2
                          ?.topColor) && (
                        <div>
                          <div className="font-utm-avo font-semibold mb-2">
                            Nhân vật 2:
                          </div>
                          <div className="ml-4 space-y-1">
                            {(selectedOrder.char2_topColor ||
                              selectedOrder.customization?.characters
                                ?.character2?.topColor?.name) && (
                              <div>
                                <span className="font-utm-avo">Áo: </span>
                                <span className="font-utm-avo">
                                  {selectedOrder.char2_topColor ||
                                    selectedOrder.customization.characters
                                      .character2.topColor.name}
                                </span>
                              </div>
                            )}
                            {(selectedOrder.char2_bottomColor ||
                              selectedOrder.customization?.characters
                                ?.character2?.bottomColor?.name) && (
                              <div>
                                <span className="font-utm-avo">Quần: </span>
                                <span className="font-utm-avo">
                                  {selectedOrder.char2_bottomColor ||
                                    selectedOrder.customization.characters
                                      .character2.bottomColor.name}
                                </span>
                              </div>
                            )}
                            {(selectedOrder.char2_face ||
                              selectedOrder.customization?.characters
                                ?.character2?.face?.name) && (
                              <div>
                                <span className="font-utm-avo">Mặt: </span>
                                <span className="font-utm-avo">
                                  {selectedOrder.char2_face ||
                                    selectedOrder.customization.characters
                                      .character2.face.name}
                                </span>
                              </div>
                            )}
                            {(selectedOrder.char2_hair ||
                              selectedOrder.customization?.characters
                                ?.character2?.hair?.name) && (
                              <div>
                                <span className="font-utm-avo">Tóc: </span>
                                <span className="font-utm-avo">
                                  {selectedOrder.char2_hair ||
                                    selectedOrder.customization.characters
                                      .character2.hair.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Additional Accessories */}
                      {(selectedOrder.customization?.additionalAccessories
                        ?.length > 0 ||
                        selectedOrder.additionalAccessories) && (
                        <div>
                          <div className="font-utm-avo font-semibold mb-2">
                            Phụ kiện thêm:
                          </div>
                          <div className="ml-4">
                            {selectedOrder.customization
                              ?.additionalAccessories ? (
                              selectedOrder.customization.additionalAccessories.map(
                                (accessory, index) => (
                                  <div key={index} className="font-utm-avo">
                                    • {accessory.name}
                                  </div>
                                )
                              )
                            ) : (
                              <div className="font-utm-avo">
                                • {selectedOrder.additionalAccessories}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Additional Pet */}
                      {(selectedOrder.customization?.additionalPet ||
                        selectedOrder.additionalPet) && (
                        <div>
                          <div className="font-utm-avo font-semibold mb-2">
                            Thú cưng:
                          </div>
                          <div className="ml-4">
                            <div className="font-utm-avo">
                              •{" "}
                              {selectedOrder.customization?.additionalPet
                                ?.name || selectedOrder.additionalPet}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Background */}
                  <div>
                    <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                      Background
                    </h3>
                    <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                      <div>
                        <span className="font-utm-avo font-semibold">
                          Mẫu:{" "}
                        </span>
                        <span className="font-utm-avo">
                          {selectedOrder.customization?.background?.template
                            ?.name ||
                            selectedOrder.backgroundTemplate ||
                            "Chưa chọn"}
                        </span>
                      </div>
                      {(selectedOrder.customization?.background?.title ||
                        selectedOrder.backgroundTitle) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Tiêu đề:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customization?.background?.title ||
                              selectedOrder.backgroundTitle}
                          </span>
                        </div>
                      )}
                      {(selectedOrder.customization?.background?.name ||
                        selectedOrder.backgroundName) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Tên:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customization?.background?.name ||
                              selectedOrder.backgroundName}
                          </span>
                        </div>
                      )}
                      {(selectedOrder.customization?.background?.date ||
                        selectedOrder.backgroundDate) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Ngày:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customization?.background?.date ||
                              selectedOrder.backgroundDate}
                          </span>
                        </div>
                      )}
                      {(selectedOrder.customization?.background?.song ||
                        selectedOrder.backgroundSong) && (
                        <div>
                          <span className="font-utm-avo font-semibold">
                            Bài hát:{" "}
                          </span>
                          <span className="font-utm-avo">
                            {selectedOrder.customization?.background?.song ||
                              selectedOrder.backgroundSong}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>{" "}
                  {/* Thời gian tạo đơn */}
                  <div className="text-center text-sm text-gray-500 font-utm-avo border-t pt-4">
                    Đơn hàng được tạo:{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
                {/* Action buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  {(selectedOrder.status === "Chờ demo" ||
                    selectedOrder.status === "Pending") && (
                    <Link to={`/finalize-order/${selectedOrder.orderId}`}>
                      <Button variant="success" size="sm">
                        Chốt đơn
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderSearchPage;
