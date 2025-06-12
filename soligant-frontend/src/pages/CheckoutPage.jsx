// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Components
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import Loading from "../components/ui/Loading";

// Mock service
import { createOrderInGoogleSheets } from "../services/mockGoogleSheets";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customization = useSelector((state) => state.customization);
  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerFacebook: "",
    customerInstagram: "",
    customerAddress: "",
    isUrgent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Họ tên là bắt buộc";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Số điện thoại là bắt buộc";
    } else if (
      !/^[0-9]{10,11}$/.test(formData.customerPhone.replace(/\s/g, ""))
    ) {
      newErrors.customerPhone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        // Customer info
        customer: formData,

        // Product customization
        customization: customization,

        // Order details
        status: "waiting_demo", // Chờ demo
        isUrgent: formData.isUrgent,
        createdAt: new Date().toISOString(),
      };

      // Mock save to Google Sheets
      const result = await createOrderInGoogleSheets(orderData);

      // Show success
      toast.success(
        `Đơn hàng đã được gửi thành công! Mã đơn: ${result.orderId}`
      );

      // Navigate to success page (we'll create this later)
      navigate(`/order-success/${result.orderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }; // Calculate total price from customization
  const calculateTotalPrice = () => {
    // Sử dụng giá đã tính sẵn từ redux state
    if (customization.totalPrice !== undefined) {
      return customization.totalPrice;
    }

    // Tính toán giá thủ công nếu không có totalPrice từ state
    let total = 0;

    // Full combo price (override individual items)
    if (customization.fullCombo) {
      total = customization.fullCombo.price;

      // Add price of additional accessories (not included in combo)
      if (
        customization.additionalAccessories &&
        customization.additionalAccessories.length > 0
      ) {
        customization.additionalAccessories.forEach((accessory) => {
          // Kiểm tra xem phụ kiện này có trong combo hay không
          const isInCombo =
            customization.fullCombo.includes?.accessories?.includes(
              accessory.id
            );
          if (!isInCombo) {
            total += accessory.price || 0;
          }
        });
      }

      // Add price of pet if not included in combo
      if (
        customization.additionalPet &&
        !customization.fullCombo.includes?.pet
      ) {
        total += customization.additionalPet.price || 0;
      }

      // Add price of hair if not included in combo
      if (
        customization.characters?.character1?.hair &&
        !customization.fullCombo.includes?.hair
      ) {
        total += customization.characters.character1.hair.price || 0;
      }

      if (
        customization.characters?.character2?.hair &&
        !customization.fullCombo.includes?.hair
      ) {
        total += customization.characters.character2.hair.price || 0;
      }

      return total;
    }

    // If no full combo, calculate based on individual items

    // Version price
    if (customization.version?.selected) {
      // Nếu version là string "version1" hoặc "version2"
      if (typeof customization.version.selected === "string") {
        total +=
          customization.version.selected === "version1"
            ? 245000
            : customization.version.selected === "version2"
            ? 250000
            : 0;
      } else {
        // Nếu version là object
        total += customization.version.selected.price || 0;
      }
    }

    // Accessory combo
    if (customization.accessoryCombo) {
      total += customization.accessoryCombo.price;
    }

    // Additional accessories
    if (
      customization.additionalAccessories &&
      customization.additionalAccessories.length > 0
    ) {
      customization.additionalAccessories.forEach((accessory) => {
        // Kiểm tra accessory có trong combo phụ kiện không
        const isInAccessoryCombo =
          customization.accessoryCombo?.includes?.includes(accessory.id);
        if (!isInAccessoryCombo) {
          total += accessory.price || 0;
        }
      });
    }

    // Additional pet
    if (customization.additionalPet) {
      total += customization.additionalPet.price || 0;
    }

    // Hair prices for character 1 and 2
    if (customization.characters?.character1?.hair) {
      total += customization.characters.character1.hair.price || 0;
    }

    if (customization.characters?.character2?.hair) {
      total += customization.characters.character2.hair.price || 0;
    }

    return total;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.h1
          className="text-3xl md:text-4xl font-utm-avo text-soligant-primary text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hoàn Tất Đơn Hàng
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-6 font-utm-avo text-soligant-primary">
              Tóm Tắt Đơn Hàng
            </h2>{" "}
            {/* Version Info */}
            {customization.version?.selected && !customization.fullCombo && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2 font-utm-avo">
                  Phiên bản:{" "}
                  {customization.version.selected === "version1"
                    ? "Version 1"
                    : customization.version.selected === "version2"
                    ? "Version 2"
                    : customization.version.selected.name ||
                      customization.version.selected}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {customization.version.selected === "version1"
                    ? "Khung tranh có 01 LEGO-nhân"
                    : customization.version.selected === "version2"
                    ? "Khung tranh có 02 LEGO-nhân"
                    : customization.version.selected.description || ""}
                </p>
                <p className="font-bold text-soligant-primary">
                  {new Intl.NumberFormat("vi-VN").format(
                    customization.version.selected === "version1"
                      ? 245000
                      : customization.version.selected === "version2"
                      ? 250000
                      : customization.version.selected.price || 0
                  )}{" "}
                  VNĐ
                </p>
              </div>
            )}{" "}
            {/* Full Combo Info */}
            {customization.fullCombo && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-lg mb-2 font-utm-avo text-green-700">
                  💎 {customization.fullCombo.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {customization.fullCombo.description}
                </p>

                {/* Display version included in combo */}
                <div className="mt-3 text-sm">
                  <span className="font-bold">Phiên bản:</span>{" "}
                  {customization.fullCombo.includes.version === "version1"
                    ? "Version 1 - Khung tranh có 01 LEGO-nhân"
                    : customization.fullCombo.includes.version === "version2"
                    ? "Version 2 - Khung tranh có 02 LEGO-nhân"
                    : ""}
                </div>

                {/* Display hair included in combo */}
                {customization.fullCombo.includes?.hair && (
                  <div className="mt-1 text-sm">
                    <span className="font-bold">Tóc:</span> Đã bao gồm trong
                    combo
                  </div>
                )}

                {/* Display accessories included in combo */}
                {customization.fullCombo.includes?.accessories?.length > 0 && (
                  <div className="mt-1 text-sm">
                    <span className="font-bold">Phụ kiện:</span>{" "}
                    {customization.fullCombo.includesText?.split("(")[0] ||
                      "Các phụ kiện đi kèm"}
                  </div>
                )}

                <p className="font-bold text-green-700 mt-3">
                  {new Intl.NumberFormat("vi-VN").format(
                    customization.fullCombo.price
                  )}{" "}
                  VNĐ
                </p>
              </div>
            )}
            {/* Character Customization */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-3 font-utm-avo">
                Tùy chỉnh nhân vật
              </h3>
              {/* Character 1 */}
              <div className="mb-3">
                <h4 className="font-semibold text-sm text-gray-700">
                  Nhân vật 1:
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {customization.characters.character1.topColor && (
                    <span className="text-xs bg-white px-2 py-1 rounded">
                      Áo: {customization.characters.character1.topColor.name}
                    </span>
                  )}
                  {customization.characters.character1.bottomColor && (
                    <span className="text-xs bg-white px-2 py-1 rounded">
                      Quần:{" "}
                      {customization.characters.character1.bottomColor.name}
                    </span>
                  )}{" "}
                  {customization.characters.character1.hair && (
                    <span className="text-xs bg-white px-2 py-1 rounded">
                      Tóc: {customization.characters.character1.hair.name}
                      {!customization.fullCombo?.includes?.hair &&
                        customization.characters.character1.hair.price && (
                          <span className="ml-1">
                            (+
                            {new Intl.NumberFormat("vi-VN").format(
                              customization.characters.character1.hair.price
                            )}{" "}
                            VNĐ)
                          </span>
                        )}
                    </span>
                  )}
                  {customization.characters.character1.face && (
                    <span className="text-xs bg-white px-2 py-1 rounded">
                      Mặt: {customization.characters.character1.face.name}
                    </span>
                  )}
                </div>
              </div>{" "}
              {/* Character 2 (if version 2) */}
              {(customization.version?.selected === "version2" ||
                customization.fullCombo?.includes?.version === "version2") && (
                <div className="mb-3">
                  <h4 className="font-semibold text-sm text-gray-700">
                    Nhân vật 2:
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {customization.characters.character2.topColor && (
                      <span className="text-xs bg-white px-2 py-1 rounded">
                        Áo: {customization.characters.character2.topColor.name}
                      </span>
                    )}
                    {customization.characters.character2.bottomColor && (
                      <span className="text-xs bg-white px-2 py-1 rounded">
                        Quần:{" "}
                        {customization.characters.character2.bottomColor.name}
                      </span>
                    )}
                    {customization.characters.character2.hair && (
                      <span className="text-xs bg-white px-2 py-1 rounded">
                        Tóc: {customization.characters.character2.hair.name}
                        {!customization.fullCombo?.includes?.hair &&
                          customization.characters.character2.hair.price && (
                            <span className="ml-1">
                              (+
                              {new Intl.NumberFormat("vi-VN").format(
                                customization.characters.character2.hair.price
                              )}{" "}
                              VNĐ)
                            </span>
                          )}
                      </span>
                    )}
                    {customization.characters.character2.face && (
                      <span className="text-xs bg-white px-2 py-1 rounded">
                        Mặt: {customization.characters.character2.face.name}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {/* Accessory Combo */}
              {customization.accessoryCombo && (
                <div className="mt-3">
                  <h4 className="font-semibold text-sm text-gray-700">
                    Combo phụ kiện:
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-800">
                      {customization.accessoryCombo.name}
                      (+
                      {new Intl.NumberFormat("vi-VN").format(
                        customization.accessoryCombo.price
                      )}{" "}
                      VNĐ)
                    </span>
                    <p className="w-full text-xs text-gray-600 mt-1">
                      {customization.accessoryCombo.includesText}
                    </p>
                  </div>
                </div>
              )}
              {/* Additional Accessories */}
              {customization.additionalAccessories &&
                customization.additionalAccessories.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold text-sm text-gray-700">
                      Phụ kiện thêm:
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {customization.additionalAccessories.map((acc) => (
                        <span
                          key={acc.id}
                          className="text-xs bg-white px-2 py-1 rounded"
                        >
                          {acc.name} (+
                          {new Intl.NumberFormat("vi-VN").format(
                            acc.price
                          )}{" "}
                          VNĐ)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              {/* Pet */}
              {customization.additionalPet && (
                <div className="mt-3">
                  <h4 className="font-semibold text-sm text-gray-700">
                    Thú cưng:
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs bg-white px-2 py-1 rounded">
                      {customization.additionalPet.name}
                      (+
                      {new Intl.NumberFormat("vi-VN").format(
                        customization.additionalPet.price
                      )}{" "}
                      VNĐ)
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* Background Info */}
            {customization.background?.template && (
              <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2 font-utm-avo">
                  Background
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Mẫu: {customization.background.template.name}
                </p>
                {customization.background.title && (
                  <p className="text-sm text-gray-600 mb-1">
                    Tiêu đề: {customization.background.title}
                  </p>
                )}
                {customization.background.name && (
                  <p className="text-sm text-gray-600 mb-1">
                    Tên: {customization.background.name}
                  </p>
                )}
                {customization.background.date && (
                  <p className="text-sm text-gray-600 mb-1">
                    Ngày: {customization.background.date}
                  </p>
                )}
                {customization.background.song && (
                  <p className="text-sm text-gray-600">
                    Bài hát: {customization.background.song}
                  </p>
                )}
              </div>
            )}
            {/* Total Price */}
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold font-utm-avo">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-soligant-primary font-utm-avo">
                  {new Intl.NumberFormat("vi-VN").format(totalPrice)} VNĐ
                </span>
              </div>
            </div>
          </motion.div>

          {/* Customer Information Form */}
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 font-utm-avo text-soligant-primary">
              Thông Tin Khách Hàng
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Họ và tên"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
                required
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm">{errors.customerName}</p>
              )}
              <FormInput
                label="Số điện thoại"
                id="customerPhone"
                name="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-sm">{errors.customerPhone}</p>
              )}
              {/* REMOVED: Email input field */}
              {/* REMOVED: Address input field */}
              <FormInput
                label="Link Facebook"
                id="customerFacebook"
                name="customerFacebook"
                value={formData.customerFacebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourprofile (tùy chọn)"
              />
              <FormInput
                label="Link Instagram"
                id="customerInstagram"
                name="customerInstagram"
                value={formData.customerInstagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourprofile (tùy chọn)"
              />
              {/* Urgent checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isUrgent"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-soligant-primary border-gray-300 rounded focus:ring-soligant-primary"
                />
                <label htmlFor="isUrgent" className="text-sm font-utm-avo">
                  Đơn hàng gấp (cần trong vòng 3-5 ngày)
                </label>
              </div>
              {/* Info note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <h4 className="font-bold text-yellow-800 mb-2 font-utm-avo">
                  📝 Lưu ý quan trọng:
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Đơn hàng sẽ ở trạng thái "Chờ demo" sau khi gửi</li>
                  <li>
                    • Chúng tôi sẽ liên hệ qua Facebook/Instagram để gửi demo
                  </li>
                  <li>• Thanh toán 100% sau khi bạn chốt demo</li>
                  <li>• Thời gian làm đơn: 3-5 ngày kể từ khi thanh toán</li>
                </ul>
              </div>
              {/* Submit button */}
              <div className="flex flex-col space-y-4 mt-8">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loading size="small" color="white" />
                      <span>Đang gửi đơn hàng...</span>
                    </div>
                  ) : (
                    "Gửi Đơn Hàng"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full"
                  disabled={loading}
                >
                  Quay lại tùy chỉnh background
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
