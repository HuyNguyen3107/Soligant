// src/pages/CopyOrderPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import { getOrderFromGoogleSheets } from "../services/mockGoogleSheets";
import {
  setVersion,
  setCharacter1TopColor,
  setCharacter1BottomColor,
  setCharacter2TopColor,
  setCharacter2BottomColor,
  setCharacter1Hair,
  setCharacter1Face,
  setCharacter2Hair,
  setCharacter2Face,
  setBackgroundTemplate,
  setBackgroundTitle,
  setBackgroundDate,
  setBackgroundName,
  setBackgroundSong,
  setFullCombo,
  setAccessoryCombo,
  addMultipleAccessories,
  setAdditionalPet,
  recalculatePrice,
  resetCustomization,
} from "../redux/features/customizationSlice";

// Import data to find complete objects
import {
  clothingColors,
  hairStyles,
  faceStyles,
  accessories,
  pets,
  fullCombo,
  accessoryCombo,
} from "../data/productData";

const CopyOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

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
        } else {
          setError("Không tìm thấy đơn hàng");
        }
      } catch (err) {
        console.error("Error loading order:", err);
        setError("Có lỗi xảy ra khi tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);  const handleCopyOrder = () => {
    if (!orderData) return;

    console.log("🔄 Starting to copy order data:", orderData);

    // Reset customization trước
    dispatch(resetCustomization());

    const customization = orderData.customization;

    // Copy version - handle both string and object format
    if (customization.version?.selected) {
      if (typeof customization.version.selected === 'string') {
        // Handle legacy string format (version1, version2)
        dispatch(setVersion(customization.version.selected));
      } else if (customization.version.selected.name) {
        // Handle object format with name
        const versionName = customization.version.selected.name;
        if (versionName.includes("Version 1") || versionName.includes("Single")) {
          dispatch(setVersion("version1"));
        } else if (versionName.includes("Version 2") || versionName.includes("Couple")) {
          dispatch(setVersion("version2"));
        }
      }
    }    // Helper function to find complete object by name or id
    const findByName = (array, name) => {
      return array.find(item => item.name === name || item.id === name);
    };

    // Helper function to find color by name (case-insensitive)
    const findColorByName = (name) => {
      return clothingColors.find(color => 
        color.name.toLowerCase() === name.toLowerCase()
      );
    };    // Copy characters with complete objects
    if (customization.characters?.character1) {
      const char1 = customization.characters.character1;
      console.log("🎭 Copying character1:", char1);
      
      if (char1.topColor?.name) {
        const topColor = findColorByName(char1.topColor.name);
        console.log("👕 Found topColor:", topColor, "for name:", char1.topColor.name);
        if (topColor) dispatch(setCharacter1TopColor(topColor));
      }
      if (char1.bottomColor?.name) {
        const bottomColor = findColorByName(char1.bottomColor.name);
        console.log("👖 Found bottomColor:", bottomColor, "for name:", char1.bottomColor.name);  
        if (bottomColor) dispatch(setCharacter1BottomColor(bottomColor));
      }
      if (char1.hair?.name) {
        const hair = findByName(hairStyles, char1.hair.name);
        console.log("💇 Found hair:", hair, "for name:", char1.hair.name);
        if (hair) dispatch(setCharacter1Hair(hair));
      }
      if (char1.face?.name) {
        const face = findByName(faceStyles, char1.face.name);
        console.log("😊 Found face:", face, "for name:", char1.face.name);
        if (face) dispatch(setCharacter1Face(face));
      }
    }

    if (customization.characters?.character2) {
      const char2 = customization.characters.character2;
      console.log("🎭 Copying character2:", char2);
      
      if (char2.topColor?.name) {
        const topColor = findColorByName(char2.topColor.name);
        if (topColor) dispatch(setCharacter2TopColor(topColor));
      }
      if (char2.bottomColor?.name) {
        const bottomColor = findColorByName(char2.bottomColor.name);
        if (bottomColor) dispatch(setCharacter2BottomColor(bottomColor));
      }
      if (char2.hair?.name) {
        const hair = findByName(hairStyles, char2.hair.name);
        if (hair) dispatch(setCharacter2Hair(hair));
      }
      if (char2.face?.name) {
        const face = findByName(faceStyles, char2.face.name);
        if (face) dispatch(setCharacter2Face(face));  
      }
    }    // Copy combos with complete objects
    if (customization.fullCombo?.name) {
      const combo = findByName(fullCombo, customization.fullCombo.name);
      console.log("🎁 Found fullCombo:", combo, "for name:", customization.fullCombo.name);
      if (combo) {
        dispatch(setFullCombo(combo));
      }
    }

    if (customization.accessoryCombo?.name) {
      const combo = findByName(accessoryCombo, customization.accessoryCombo.name);
      console.log("🧳 Found accessoryCombo:", combo, "for name:", customization.accessoryCombo.name);
      if (combo) {
        dispatch(setAccessoryCombo(combo));
      }
    }

    // Copy accessories with complete objects
    if (customization.additionalAccessories?.length > 0) {
      console.log("🎒 Copying accessories:", customization.additionalAccessories);
      const completeAccessories = customization.additionalAccessories
        .map(acc => {
          const found = findByName(accessories, acc.name);
          console.log("🔍 Found accessory:", found, "for name:", acc.name);
          return found;
        })
        .filter(Boolean); // Remove null/undefined entries
      
      console.log("✅ Complete accessories to dispatch:", completeAccessories);
      if (completeAccessories.length > 0) {
        dispatch(addMultipleAccessories(completeAccessories));
      }
    }

    // Copy pet with complete object
    if (customization.additionalPet?.name) {
      const pet = findByName(pets, customization.additionalPet.name);
      console.log("🐾 Found pet:", pet, "for name:", customization.additionalPet.name);
      if (pet) {
        dispatch(setAdditionalPet(pet));
      }
    }

    // Copy background
    if (customization.background?.template?.name) {
      dispatch(setBackgroundTemplate({
        name: customization.background.template.name,
      }));
      
      if (customization.background.title) {
        dispatch(setBackgroundTitle(customization.background.title));
      }
      if (customization.background.date) {
        dispatch(setBackgroundDate(customization.background.date));
      }
      if (customization.background.name) {
        dispatch(setBackgroundName(customization.background.name));
      }
      if (customization.background.song) {
        dispatch(setBackgroundSong(customization.background.song));
      }
    }

    // Recalculate price
    dispatch(recalculatePrice());

    toast.success("Đã sao chép đơn hàng thành công!");

    // Navigate to customize page
    navigate("/collections/dear-you/customize");
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
          Sao chép đơn hàng
        </motion.h1>{" "}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <div className="text-center pb-4 border-b mb-6">
              <h2 className="text-2xl font-bold font-utm-avo text-soligant-primary mb-2">
                📋 Sao chép đơn hàng
              </h2>
              <p className="text-gray-600 font-utm-avo">
                Mã đơn hàng: #{orderData?.orderId}
              </p>
            </div>

            <div className="space-y-6">
              {/* Thông tin khách hàng */}
              <div>
                <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                  Thông tin khách hàng
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="font-utm-avo font-semibold">Tên: </span>
                    <span className="font-utm-avo">
                      {orderData?.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="font-utm-avo font-semibold">SĐT: </span>
                    <span className="font-utm-avo">
                      {orderData?.customerPhone}
                    </span>
                  </div>
                  {orderData?.customerEmail && (
                    <div>
                      <span className="font-utm-avo font-semibold">
                        Email:{" "}
                      </span>
                      <span className="font-utm-avo">
                        {orderData.customerEmail}
                      </span>
                    </div>
                  )}
                  {orderData?.customerFacebook && (
                    <div>
                      <span className="font-utm-avo font-semibold">
                        Facebook:{" "}
                      </span>
                      <span className="font-utm-avo">
                        {orderData.customerFacebook}
                      </span>
                    </div>
                  )}
                  {orderData?.customerInstagram && (
                    <div>
                      <span className="font-utm-avo font-semibold">
                        Instagram:{" "}
                      </span>
                      <span className="font-utm-avo">
                        {orderData.customerInstagram}
                      </span>
                    </div>
                  )}
                  {orderData?.customerAddress && (
                    <div>
                      <span className="font-utm-avo font-semibold">
                        Địa chỉ:{" "}
                      </span>
                      <span className="font-utm-avo">
                        {orderData.customerAddress}
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
                      {orderData?.status === "Chờ xác nhận"
                        ? "🕒"
                        : orderData?.status === "Chờ demo"
                        ? "🎨"
                        : orderData?.status === "Đang sản xuất"
                        ? "⚒️"
                        : orderData?.status === "Đang vận chuyển"
                        ? "🚚"
                        : orderData?.status === "Hoàn thành"
                        ? "✅"
                        : orderData?.status === "Đã giao"
                        ? "📦"
                        : "📋"}
                    </span>
                    <span className="font-utm-avo font-semibold text-lg">
                      {orderData?.status}
                    </span>
                  </div>
                  {orderData?.isUrgent && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      <span className="font-utm-avo font-semibold text-red-600">
                        Gấp
                      </span>
                    </div>
                  )}
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
                      {orderData?.customization?.version?.selected?.name ||
                        orderData?.version}
                      {orderData?.customization?.version?.selected
                        ?.description &&
                        ` - ${orderData.customization.version.selected.description}`}
                      <span className="text-green-600 font-bold">
                        (
                        {new Intl.NumberFormat("vi-VN").format(
                          orderData?.customization?.version?.selected?.price ||
                            orderData?.versionPrice ||
                            0
                        )}{" "}
                        VNĐ)
                      </span>
                    </span>
                  </div>

                  {/* Full Combo */}
                  {(orderData?.customization?.fullCombo ||
                    orderData?.fullCombo) && (
                    <div>
                      <div className="mb-2">
                        <span className="font-utm-avo font-semibold">
                          Full Combo:{" "}
                        </span>
                        <span className="font-utm-avo">
                          {orderData.customization?.fullCombo?.name ||
                            orderData.fullCombo}
                          <span className="text-green-600 font-bold">
                            (
                            {new Intl.NumberFormat("vi-VN").format(
                              orderData.customization?.fullCombo?.price ||
                                orderData.fullComboPrice ||
                                0
                            )}{" "}
                            VNĐ)
                          </span>
                        </span>
                      </div>
                      <div className="ml-4 text-sm text-gray-600">
                        <div className="font-utm-avo font-medium mb-1">
                          Bao gồm:
                        </div>
                        <ul className="font-utm-avo space-y-1">
                          <li>• 2 Minifigure LEGO tùy chỉnh</li>
                          <li>• Background 3D theo chủ đề</li>
                          <li>• Hộp quà cao cấp</li>
                          <li>• Thiệp chúc mừng</li>
                          <li>• Phụ kiện trang trí</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Accessory Combo */}
                  {(orderData?.customization?.accessoryCombo ||
                    orderData?.accessoryCombo) && (
                    <div>
                      <div className="mb-2">
                        <span className="font-utm-avo font-semibold">
                          Combo Phụ kiện:{" "}
                        </span>
                        <span className="font-utm-avo">
                          {orderData.customization?.accessoryCombo?.name ||
                            orderData.accessoryCombo}
                          <span className="text-green-600 font-bold">
                            (
                            {new Intl.NumberFormat("vi-VN").format(
                              orderData.customization?.accessoryCombo?.price ||
                                orderData.accessoryComboPrice ||
                                0
                            )}{" "}
                            VNĐ)
                          </span>
                        </span>
                      </div>
                      <div className="ml-4 text-sm text-gray-600">
                        <div className="font-utm-avo font-medium mb-1">
                          Bao gồm:
                        </div>
                        <ul className="font-utm-avo space-y-1">
                          {(() => {
                            const comboName =
                              orderData.customization?.accessoryCombo?.name ||
                              orderData.accessoryCombo;
                            if (comboName?.includes("Lifestyle")) {
                              return (
                                <>
                                  <li>• Cặp sách mini</li>
                                  <li>• Laptop LEGO</li>
                                  <li>• Cốc cà phê</li>
                                  <li>• Điện thoại</li>
                                  <li>• Kính mắt thời trang</li>
                                </>
                              );
                            } else if (comboName?.includes("Sáng tạo")) {
                              return (
                                <>
                                  <li>• Bảng vẽ mini</li>
                                  <li>• Cọ vẽ</li>
                                  <li>• Máy ảnh LEGO</li>
                                  <li>• Sách phác thảo</li>
                                  <li>• Palette màu</li>
                                </>
                              );
                            } else if (comboName?.includes("Gaming")) {
                              return (
                                <>
                                  <li>• Tay cầm game</li>
                                  <li>• Tai nghe gaming</li>
                                  <li>• Bàn phím cơ mini</li>
                                  <li>• Màn hình gaming</li>
                                  <li>• Chuột gaming</li>
                                </>
                              );
                            } else if (comboName?.includes("Nghệ thuật")) {
                              return (
                                <>
                                  <li>• Đàn guitar mini</li>
                                  <li>• Microphone</li>
                                  <li>• Kệ nhạc</li>
                                  <li>• Loa bluetooth</li>
                                  <li>• Đĩa vinyl</li>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <li>• Phụ kiện chủ đề</li>
                                  <li>• Đồ trang trí</li>
                                  <li>• Món đồ cá nhân hóa</li>
                                </>
                              );
                            }
                          })()}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin giá */}
              <div>
                <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                  Thông tin giá
                </h3>
                <div className="bg-emerald-50 rounded-lg p-4 space-y-3">
                  {/* Chi tiết giá */}
                  <div className="space-y-2">
                    {/* Version Price */}
                    {(orderData?.versionPrice ||
                      orderData?.customization?.version?.selected?.price) && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-utm-avo">
                          {orderData.customization?.version?.selected?.name ||
                            orderData.version}
                          :
                        </span>
                        <span className="font-utm-avo font-medium">
                          {new Intl.NumberFormat("vi-VN").format(
                            orderData.versionPrice ||
                              orderData.customization?.version?.selected
                                ?.price ||
                              0
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}

                    {/* Full Combo Price */}
                    {(orderData?.fullComboPrice ||
                      orderData?.customization?.fullCombo?.price) && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-utm-avo">
                          {orderData.customization?.fullCombo?.name ||
                            orderData.fullCombo}
                          :
                        </span>
                        <span className="font-utm-avo font-medium">
                          {new Intl.NumberFormat("vi-VN").format(
                            orderData.fullComboPrice ||
                              orderData.customization?.fullCombo?.price ||
                              0
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}

                    {/* Accessory Combo Price */}
                    {(orderData?.accessoryComboPrice ||
                      orderData?.customization?.accessoryCombo?.price) && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-utm-avo">
                          {orderData.customization?.accessoryCombo?.name ||
                            orderData.accessoryCombo}
                          :
                        </span>
                        <span className="font-utm-avo font-medium">
                          {new Intl.NumberFormat("vi-VN").format(
                            orderData.accessoryComboPrice ||
                              orderData.customization?.accessoryCombo?.price ||
                              0
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}

                    {/* Additional items */}
                    {orderData?.additionalAccessoriesPrice && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-utm-avo">Phụ kiện thêm:</span>
                        <span className="font-utm-avo font-medium">
                          {new Intl.NumberFormat("vi-VN").format(
                            orderData.additionalAccessoriesPrice
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}

                    {orderData?.additionalPetPrice && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-utm-avo">Thú cưng:</span>
                        <span className="font-utm-avo font-medium">
                          {new Intl.NumberFormat("vi-VN").format(
                            orderData.additionalPetPrice
                          )}{" "}
                          VNĐ
                        </span>
                      </div>
                    )}

                    {orderData?.shippingFee !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-utm-avo">Phí vận chuyển:</span>
                        <span className="font-utm-avo font-medium">
                          {orderData.shippingFee === 0
                            ? "Miễn phí"
                            : `${new Intl.NumberFormat("vi-VN").format(
                                orderData.shippingFee
                              )} VNĐ`}
                        </span>
                      </div>
                    )}

                    {orderData?.discount && (
                      <div className="flex justify-between items-center text-sm text-red-600">
                        <span className="font-utm-avo">Giảm giá:</span>
                        <span className="font-utm-avo font-medium">
                          -
                          {new Intl.NumberFormat("vi-VN").format(
                            orderData.discount
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
                        orderData?.totalPrice || orderData?.totalAmount || 0
                      )}{" "}
                      VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {/* Tùy chỉnh nhân vật */}
              <div>
                <h3 className="text-lg font-bold font-utm-avo text-gray-800 mb-3">
                  Tùy chỉnh nhân vật
                </h3>
                <div className="bg-yellow-50 rounded-lg p-4 space-y-4">
                  {/* Character 1 */}
                  {(orderData?.char1_topColor ||
                    orderData?.customization?.characters?.character1
                      ?.topColor) && (
                    <div>
                      <div className="font-utm-avo font-semibold mb-2">
                        Nhân vật 1:
                      </div>
                      <div className="ml-4 space-y-1">
                        {(orderData.char1_topColor ||
                          orderData.customization?.characters?.character1
                            ?.topColor?.name) && (
                          <div>
                            <span className="font-utm-avo">Áo: </span>
                            <span className="font-utm-avo">
                              {orderData.char1_topColor ||
                                orderData.customization.characters.character1
                                  .topColor.name}
                            </span>
                          </div>
                        )}
                        {(orderData.char1_bottomColor ||
                          orderData.customization?.characters?.character1
                            ?.bottomColor?.name) && (
                          <div>
                            <span className="font-utm-avo">Quần: </span>
                            <span className="font-utm-avo">
                              {orderData.char1_bottomColor ||
                                orderData.customization.characters.character1
                                  .bottomColor.name}
                            </span>
                          </div>
                        )}
                        {(orderData.char1_face ||
                          orderData.customization?.characters?.character1?.face
                            ?.name) && (
                          <div>
                            <span className="font-utm-avo">Mặt: </span>
                            <span className="font-utm-avo">
                              {orderData.char1_face ||
                                orderData.customization.characters.character1
                                  .face.name}
                            </span>
                          </div>
                        )}
                        {(orderData.char1_hair ||
                          orderData.customization?.characters?.character1?.hair
                            ?.name) && (
                          <div>
                            <span className="font-utm-avo">Tóc: </span>
                            <span className="font-utm-avo">
                              {orderData.char1_hair ||
                                orderData.customization.characters.character1
                                  .hair.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Character 2 */}
                  {(orderData?.char2_topColor ||
                    orderData?.customization?.characters?.character2
                      ?.topColor) && (
                    <div>
                      <div className="font-utm-avo font-semibold mb-2">
                        Nhân vật 2:
                      </div>
                      <div className="ml-4 space-y-1">
                        {(orderData.char2_topColor ||
                          orderData.customization?.characters?.character2
                            ?.topColor?.name) && (
                          <div>
                            <span className="font-utm-avo">Áo: </span>
                            <span className="font-utm-avo">
                              {orderData.char2_topColor ||
                                orderData.customization.characters.character2
                                  .topColor.name}
                            </span>
                          </div>
                        )}
                        {(orderData.char2_bottomColor ||
                          orderData.customization?.characters?.character2
                            ?.bottomColor?.name) && (
                          <div>
                            <span className="font-utm-avo">Quần: </span>
                            <span className="font-utm-avo">
                              {orderData.char2_bottomColor ||
                                orderData.customization.characters.character2
                                  .bottomColor.name}
                            </span>
                          </div>
                        )}
                        {(orderData.char2_face ||
                          orderData.customization?.characters?.character2?.face
                            ?.name) && (
                          <div>
                            <span className="font-utm-avo">Mặt: </span>
                            <span className="font-utm-avo">
                              {orderData.char2_face ||
                                orderData.customization.characters.character2
                                  .face.name}
                            </span>
                          </div>
                        )}
                        {(orderData.char2_hair ||
                          orderData.customization?.characters?.character2?.hair
                            ?.name) && (
                          <div>
                            <span className="font-utm-avo">Tóc: </span>
                            <span className="font-utm-avo">
                              {orderData.char2_hair ||
                                orderData.customization.characters.character2
                                  .hair.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional items */}
                  {(orderData?.customization?.additionalAccessories?.length >
                    0 ||
                    orderData?.additionalAccessories) && (
                    <div>
                      <div className="font-utm-avo font-semibold mb-2">
                        Phụ kiện thêm:
                      </div>
                      <div className="ml-4">
                        {orderData.customization?.additionalAccessories ? (
                          orderData.customization.additionalAccessories.map(
                            (accessory, index) => (
                              <div key={index} className="font-utm-avo">
                                • {accessory.name}
                              </div>
                            )
                          )
                        ) : (
                          <div className="font-utm-avo">
                            • {orderData.additionalAccessories}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(orderData?.customization?.additionalPet ||
                    orderData?.additionalPet) && (
                    <div>
                      <div className="font-utm-avo font-semibold mb-2">
                        Thú cưng:
                      </div>
                      <div className="ml-4">
                        <div className="font-utm-avo">
                          •{" "}
                          {orderData.customization?.additionalPet?.name ||
                            orderData.additionalPet}
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
                    <span className="font-utm-avo font-semibold">Mẫu: </span>
                    <span className="font-utm-avo">
                      {orderData?.customization?.background?.template?.name ||
                        orderData?.backgroundTemplate ||
                        "Chưa chọn"}
                    </span>
                  </div>
                  {(orderData?.customization?.background?.title ||
                    orderData?.backgroundTitle) && (
                    <div>
                      <span className="font-utm-avo font-semibold">
                        Tiêu đề:{" "}
                      </span>
                      <span className="font-utm-avo">
                        {orderData.customization?.background?.title ||
                          orderData.backgroundTitle}
                      </span>
                    </div>
                  )}
                  {(orderData?.customization?.background?.name ||
                    orderData?.backgroundName) && (
                    <div>
                      <span className="font-utm-avo font-semibold">Tên: </span>
                      <span className="font-utm-avo">
                        {orderData.customization?.background?.name ||
                          orderData.backgroundName}
                      </span>
                    </div>
                  )}
                  {(orderData?.customization?.background?.date ||
                    orderData?.backgroundDate) && (
                    <div>
                      <span className="font-utm-avo font-semibold">Ngày: </span>
                      <span className="font-utm-avo">
                        {orderData.customization?.background?.date ||
                          orderData.backgroundDate}
                      </span>
                    </div>
                  )}
                  {(orderData?.customization?.background?.song ||
                    orderData?.backgroundSong) && (
                    <div>
                      <span className="font-utm-avo font-semibold">
                        Bài hát:{" "}
                      </span>
                      <span className="font-utm-avo">
                        {orderData.customization?.background?.song ||
                          orderData.backgroundSong}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-800 mb-2 font-utm-avo">
                📋 Sao chép đơn hàng
              </h3>
              <p className="text-blue-700 text-sm font-utm-avo">
                Khi sao chép, tất cả thông tin tùy chỉnh sản phẩm và background
                sẽ được copy. Bạn có thể điều chỉnh lại thông tin trước khi đặt
                hàng mới.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/order-search")}
              >
                Quay lại
              </Button>
              <Button variant="primary" onClick={handleCopyOrder}>
                Sao chép và tùy chỉnh
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CopyOrderPage;
