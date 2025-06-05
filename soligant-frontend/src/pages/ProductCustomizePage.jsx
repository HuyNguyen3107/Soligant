// src/pages/ProductCustomizePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Components
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import ColorPicker from "../components/ui/ColorPicker";
import VersionSelector from "../components/ui/VersionSelector";
import ProductOptionSelector from "../components/ui/ProductOptionSelector";
import ComboSelector from "../components/ui/ComboSelector";

// Data
import {
  clothingColors,
  outfits,
  hairStyles,
  faceStyles,
  accessories,
  pets,
  combos,
} from "../data/productData";

// Redux actions
import {
  setCollection,
  setVersion,
  setCharacter1TopColor,
  setCharacter1BottomColor,
  setCharacter2TopColor,
  setCharacter2BottomColor,
  setCharacter1Face,
  setCharacter1Hair,
  setCharacter2Face,
  setCharacter2Hair,
  setOutfit,
  addAccessory,
  removeAccessory,
  setPet,
  addCombo,
  removeCombo,
  setCurrentStep,
  recalculatePrice,
} from "../redux/features/customizationSlice";

const ProductCustomizePage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [loading, setLoading] = useState(true);
  const [collection, setCollectionData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("version"); // 'version', 'character1', 'character2', 'accessories', 'pets', 'combos'

  // Redux state
  const customization = useSelector((state) => state.customization);

  // Lấy dữ liệu collection từ API
  useEffect(() => {
    const fetchCollectionData = async () => {
      setLoading(true);
      try {
        // Giả lập API call
        setTimeout(() => {
          // Mock collection data
          const mockCollection = {
            id: collectionId,
            name: "dear-you",
            display_name: "DEAR YOU",
            description: "Bộ sưu tập quà tặng tinh tế cho người thân yêu",
          };

          setCollectionData(mockCollection);
          dispatch(
            setCollection({
              id: mockCollection.id,
              name: mockCollection.display_name,
            })
          );
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching collection:", err);
        setError("Không thể tải thông tin bộ sưu tập");
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionId, dispatch]);

  // Version data
  const versions = [
    {
      id: "version1",
      name: "Version 1",
      price: 245000,
      description: "Khung tranh bên trong có 01 LEGO",
    },
    {
      id: "version2",
      name: "Version 2",
      price: 250000,
      description: "Khung tranh bên trong có 02 LEGO",
    },
  ];

  // Handlers
  const handleVersionSelect = (versionId) => {
    dispatch(setVersion(versionId));
    setSelectedTab("character1");
  };

  const handleCharacter1TopColorChange = (color) => {
    dispatch(setCharacter1TopColor(color));
  };

  const handleCharacter1BottomColorChange = (color) => {
    dispatch(setCharacter1BottomColor(color));
  };

  const handleCharacter2TopColorChange = (color) => {
    dispatch(setCharacter2TopColor(color));
  };

  const handleCharacter2BottomColorChange = (color) => {
    dispatch(setCharacter2BottomColor(color));
  };

  const handleOutfitSelect = (outfit) => {
    const selectedOutfit = outfits.find((o) => o.id === outfit);
    if (selectedOutfit) {
      dispatch(setOutfit(selectedOutfit.id));
    }
  };

  const handleHairSelect = (hair) => {
    if (selectedTab === "character1") {
      dispatch(setCharacter1Hair(hair));
    } else if (selectedTab === "character2") {
      dispatch(setCharacter2Hair(hair));
    }

    // Recalculate total price
    dispatch(recalculatePrice());
  };

  const handleFaceSelect = (face) => {
    if (selectedTab === "character1") {
      dispatch(setCharacter1Face(face));
    } else if (selectedTab === "character2") {
      dispatch(setCharacter2Face(face));
    }

    // Recalculate total price
    dispatch(recalculatePrice());
  };

  const handleAccessoryToggle = (accessory) => {
    const existingAccessory = customization.accessories.find(
      (acc) => acc.id === accessory.id
    );

    if (existingAccessory) {
      dispatch(removeAccessory(accessory.id));
    } else {
      dispatch(addAccessory(accessory));
    }

    // Recalculate total price
    dispatch(recalculatePrice());
  };

  const handlePetSelect = (pet) => {
    if (customization.pet && customization.pet.id === pet.id) {
      // Deselect if already selected
      dispatch(setPet(null));
    } else {
      dispatch(setPet(pet));
    }

    // Recalculate total price
    dispatch(recalculatePrice());
  };

  const handleComboToggle = (combo) => {
    const existingCombo = customization.combo.find((c) => c.id === combo.id);

    if (existingCombo) {
      dispatch(removeCombo(combo.id));
    } else {
      dispatch(addCombo(combo));
    }

    // Recalculate total price
    dispatch(recalculatePrice());
  };

  const handleProceedToBackground = () => {
    // Validation
    if (!customization.version.selected) {
      toast.warning("Vui lòng chọn phiên bản sản phẩm");
      setSelectedTab("version");
      return;
    }

    if (
      !customization.characters.character1.topColor ||
      !customization.characters.character1.bottomColor
    ) {
      toast.warning("Vui lòng chọn màu áo và quần cho nhân vật 1");
      setSelectedTab("character1");
      return;
    }

    if (!customization.characters.character1.face) {
      toast.warning("Vui lòng chọn kiểu mặt cho nhân vật 1");
      setSelectedTab("character1");
      return;
    }

    if (!customization.characters.character1.hair) {
      toast.warning("Vui lòng chọn kiểu tóc cho nhân vật 1");
      setSelectedTab("character1");
      return;
    }

    if (customization.version.selected === "version2") {
      if (
        !customization.characters.character2.topColor ||
        !customization.characters.character2.bottomColor
      ) {
        toast.warning("Vui lòng chọn màu áo và quần cho nhân vật 2");
        setSelectedTab("character2");
        return;
      }

      if (!customization.characters.character2.face) {
        toast.warning("Vui lòng chọn kiểu mặt cho nhân vật 2");
        setSelectedTab("character2");
        return;
      }

      if (!customization.characters.character2.hair) {
        toast.warning("Vui lòng chọn kiểu tóc cho nhân vật 2");
        setSelectedTab("character2");
        return;
      }
    }

    // Điều hướng đến trang background
    dispatch(setCurrentStep("background"));
    navigate(`/collections/${collectionId}/background`);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (selectedTab) {
      case "version":
        return (
          <VersionSelector
            versions={versions}
            selectedVersion={customization.version.selected}
            onSelectVersion={handleVersionSelect}
          />
        );

      case "character1":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 font-utm-avo">
              Tùy chỉnh Nhân vật 1 (Bên trái)
            </h2>

            {/* Quần áo */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 font-utm-avo">
                Màu quần áo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ColorPicker
                  colors={clothingColors}
                  selectedColor={customization.characters.character1.topColor}
                  onSelectColor={handleCharacter1TopColorChange}
                  label="Màu áo"
                />
                <ColorPicker
                  colors={clothingColors}
                  selectedColor={
                    customization.characters.character1.bottomColor
                  }
                  onSelectColor={handleCharacter1BottomColorChange}
                  label="Màu quần"
                />
              </div>
            </div>

            {/* Outfit mẫu */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={outfits.map((outfit) => ({
                  id: outfit.id,
                  name: outfit.name,
                  imageUrl: outfit.imageUrl,
                  description: outfit.description,
                }))}
                selectedItemId={customization.outfit}
                onSelectItem={(outfit) => handleOutfitSelect(outfit.id)}
                title="Outfit mẫu"
                itemsPerRow={3}
              />
            </div>

            {/* Kiểu tóc */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={hairStyles.filter(
                  (hair) => hair.gender === "female" || hair.gender === "both"
                )}
                selectedItemId={customization.characters.character1.hair?.id}
                onSelectItem={handleHairSelect}
                title="Chọn kiểu tóc"
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>

            {/* Kiểu mặt */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={faceStyles.filter(
                  (face) => face.gender === "female" || face.gender === "both"
                )}
                selectedItemId={customization.characters.character1.face?.id}
                onSelectItem={handleFaceSelect}
                title="Chọn kiểu mặt"
                itemsPerRow={4}
              />
            </div>
          </>
        );

      case "character2":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 font-utm-avo">
              Tùy chỉnh Nhân vật 2 (Bên phải)
            </h2>

            {/* Quần áo */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 font-utm-avo">
                Màu quần áo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ColorPicker
                  colors={clothingColors}
                  selectedColor={customization.characters.character2.topColor}
                  onSelectColor={handleCharacter2TopColorChange}
                  label="Màu áo"
                />
                <ColorPicker
                  colors={clothingColors}
                  selectedColor={
                    customization.characters.character2.bottomColor
                  }
                  onSelectColor={handleCharacter2BottomColorChange}
                  label="Màu quần"
                />
              </div>
            </div>

            {/* Kiểu tóc */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={hairStyles.filter(
                  (hair) => hair.gender === "male" || hair.gender === "both"
                )}
                selectedItemId={customization.characters.character2.hair?.id}
                onSelectItem={handleHairSelect}
                title="Chọn kiểu tóc"
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>

            {/* Kiểu mặt */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={faceStyles.filter(
                  (face) => face.gender === "male" || face.gender === "both"
                )}
                selectedItemId={customization.characters.character2.face?.id}
                onSelectItem={handleFaceSelect}
                title="Chọn kiểu mặt"
                itemsPerRow={4}
              />
            </div>
          </>
        );

      case "accessories":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 font-utm-avo">
              Phụ kiện cầm tay
            </h2>
            <p className="mb-4 text-gray-600 font-utm-avo">
              Chọn phụ kiện thêm vào để tạo nên sản phẩm độc đáo. Bạn có thể
              chọn nhiều phụ kiện khác nhau.
            </p>

            {/* Phụ kiện đồ dùng */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={accessories.filter(
                  (acc) => acc.type === "bag" || acc.type === "device"
                )}
                selectedItemId={customization.accessories.map((acc) => acc.id)}
                onSelectItem={handleAccessoryToggle}
                title="Túi xách & Thiết bị"
                multiple={true}
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>

            {/* Phụ kiện đồ ăn */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={accessories.filter((acc) => acc.type === "food")}
                selectedItemId={customization.accessories.map((acc) => acc.id)}
                onSelectItem={handleAccessoryToggle}
                title="Đồ ăn"
                multiple={true}
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>

            {/* Phụ kiện hoa */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={accessories.filter((acc) => acc.type === "flower")}
                selectedItemId={customization.accessories.map((acc) => acc.id)}
                onSelectItem={handleAccessoryToggle}
                title="Hoa"
                multiple={true}
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>

            {/* Các phụ kiện khác */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={accessories.filter(
                  (acc) =>
                    acc.type !== "bag" &&
                    acc.type !== "device" &&
                    acc.type !== "food" &&
                    acc.type !== "flower"
                )}
                selectedItemId={customization.accessories.map((acc) => acc.id)}
                onSelectItem={handleAccessoryToggle}
                title="Phụ kiện khác"
                multiple={true}
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>
          </>
        );

      case "pets":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 font-utm-avo">Thú cưng</h2>
            <p className="mb-4 text-gray-600 font-utm-avo">
              Thêm thú cưng để làm đẹp cho sản phẩm của bạn. Bạn chỉ có thể chọn
              một thú cưng.
            </p>

            {/* Mèo */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={pets.filter((pet) => pet.type === "cat")}
                selectedItemId={customization.pet?.id}
                onSelectItem={handlePetSelect}
                title="Mèo"
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>

            {/* Chó */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={pets.filter((pet) => pet.type === "dog")}
                selectedItemId={customization.pet?.id}
                onSelectItem={handlePetSelect}
                title="Chó"
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>

            {/* Các thú cưng khác */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={pets.filter(
                  (pet) => pet.type !== "cat" && pet.type !== "dog"
                )}
                selectedItemId={customization.pet?.id}
                onSelectItem={handlePetSelect}
                title="Các thú cưng khác"
                itemPrice={true}
                itemsPerRow={4}
              />
            </div>
          </>
        );

      case "combos":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 font-utm-avo">
              Combo ưu đãi
            </h2>
            <p className="mb-4 text-gray-600 font-utm-avo">
              Chọn combo để được giá ưu đãi hơn so với mua lẻ từng món.
            </p>

            <ComboSelector
              combos={combos.filter(
                (combo) =>
                  combo.version === null ||
                  combo.version === customization.version.selected
              )}
              selectedCombos={customization.combo}
              onSelectCombo={handleComboToggle}
            />
          </>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="font-utm-avo">
              Vui lòng chọn tab để tiếp tục tùy chỉnh
            </p>
          </div>
        );
    }
  };

  // Kiểm tra xem tab character2 có được hiển thị không
  const showCharacter2Tab = customization.version.selected === "version2";

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <Loading size="large" />
        <p className="mt-4 font-utm-avo">Đang tải thông tin bộ sưu tập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4 font-utm-avo">
          Đã xảy ra lỗi
        </h2>
        <p className="mb-6 font-utm-avo">{error}</p>
        <Button variant="primary" onClick={() => navigate("/collections")}>
          Quay lại danh sách bộ sưu tập
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.h1
        className="text-3xl md:text-4xl font-rafgins text-soligant-primary text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tùy chỉnh sản phẩm - {collection.display_name}
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview và thông tin đơn hàng */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 font-utm-avo">
              Thông tin đặt hàng
            </h2>

            {/* Version */}
            <div className="mb-4">
              <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                Phiên bản:
              </h3>
              <p className="font-utm-avo">
                {customization.version.selected === "version1"
                  ? "Version 1 - Khung tranh có 01 LEGO"
                  : customization.version.selected === "version2"
                  ? "Version 2 - Khung tranh có 02 LEGO"
                  : "Chưa chọn"}
              </p>
            </div>

            {/* Nhân vật 1 */}
            <div className="mb-4">
              <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                Nhân vật 1:
              </h3>
              <ul className="pl-4 list-disc">
                <li className="font-utm-avo">
                  Màu áo:{" "}
                  {customization.characters.character1.topColor?.name ||
                    "Chưa chọn"}
                </li>
                <li className="font-utm-avo">
                  Màu quần:{" "}
                  {customization.characters.character1.bottomColor?.name ||
                    "Chưa chọn"}
                </li>
                <li className="font-utm-avo">
                  Kiểu tóc:{" "}
                  {customization.characters.character1.hair?.name ||
                    "Chưa chọn"}
                </li>
                <li className="font-utm-avo">
                  Kiểu mặt:{" "}
                  {customization.characters.character1.face?.name ||
                    "Chưa chọn"}
                </li>
              </ul>
            </div>

            {/* Nhân vật 2 - chỉ hiển thị khi chọn version 2 */}
            {customization.version.selected === "version2" && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Nhân vật 2:
                </h3>
                <ul className="pl-4 list-disc">
                  <li className="font-utm-avo">
                    Màu áo:{" "}
                    {customization.characters.character2.topColor?.name ||
                      "Chưa chọn"}
                  </li>
                  <li className="font-utm-avo">
                    Màu quần:{" "}
                    {customization.characters.character2.bottomColor?.name ||
                      "Chưa chọn"}
                  </li>
                  <li className="font-utm-avo">
                    Kiểu tóc:{" "}
                    {customization.characters.character2.hair?.name ||
                      "Chưa chọn"}
                  </li>
                  <li className="font-utm-avo">
                    Kiểu mặt:{" "}
                    {customization.characters.character2.face?.name ||
                      "Chưa chọn"}
                  </li>
                </ul>
              </div>
            )}

            {/* Outfit */}
            {customization.outfit && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Outfit:
                </h3>
                <p className="font-utm-avo">
                  {outfits.find((o) => o.id === customization.outfit)?.name ||
                    ""}
                </p>
              </div>
            )}

            {/* Phụ kiện */}
            {customization.accessories.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Phụ kiện:
                </h3>
                <ul className="pl-4 list-disc">
                  {customization.accessories.map((acc) => (
                    <li key={acc.id} className="font-utm-avo">
                      {acc.name} (
                      {new Intl.NumberFormat("vi-VN").format(acc.price)} VNĐ)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Thú cưng */}
            {customization.pet && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Thú cưng:
                </h3>
                <p className="font-utm-avo">
                  {customization.pet.name} (
                  {new Intl.NumberFormat("vi-VN").format(
                    customization.pet.price
                  )}{" "}
                  VNĐ)
                </p>
              </div>
            )}

            {/* Combo */}
            {customization.combo.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Combo ưu đãi:
                </h3>
                <ul className="pl-4 list-disc">
                  {customization.combo.map((combo) => (
                    <li key={combo.id} className="font-utm-avo">
                      {combo.name} (
                      {new Intl.NumberFormat("vi-VN").format(combo.price)} VNĐ)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tổng tiền */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-utm-avo">Tổng tiền:</span>
                <span className="text-xl font-bold text-soligant-primary font-utm-avo">
                  {new Intl.NumberFormat("vi-VN").format(
                    customization.totalPrice
                  )}{" "}
                  VNĐ
                </span>
              </div>
              <p className="text-sm text-gray-500 italic font-utm-avo">
                * Phí ship sẽ được tính khi đặt hàng
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full mt-6"
              onClick={handleProceedToBackground}
            >
              Tiếp tục - Tùy chỉnh background
            </Button>
          </div>
        </div>

        {/* Tabs tùy chỉnh */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          {/* Tab selection */}
          <div className="bg-white rounded-lg shadow-lg mb-6 overflow-x-auto">
            <div className="flex min-w-max">
              <button
                className={`px-4 py-3 font-utm-avo font-medium text-sm ${
                  selectedTab === "version"
                    ? "text-soligant-primary border-b-2 border-soligant-primary"
                    : "text-gray-500 hover:text-soligant-primary"
                }`}
                onClick={() => setSelectedTab("version")}
              >
                Phiên bản
              </button>

              <button
                className={`px-4 py-3 font-utm-avo font-medium text-sm ${
                  selectedTab === "character1"
                    ? "text-soligant-primary border-b-2 border-soligant-primary"
                    : "text-gray-500 hover:text-soligant-primary"
                }`}
                onClick={() => setSelectedTab("character1")}
              >
                Nhân vật 1
              </button>

              {showCharacter2Tab && (
                <button
                  className={`px-4 py-3 font-utm-avo font-medium text-sm ${
                    selectedTab === "character2"
                      ? "text-soligant-primary border-b-2 border-soligant-primary"
                      : "text-gray-500 hover:text-soligant-primary"
                  }`}
                  onClick={() => setSelectedTab("character2")}
                >
                  Nhân vật 2
                </button>
              )}

              <button
                className={`px-4 py-3 font-utm-avo font-medium text-sm ${
                  selectedTab === "accessories"
                    ? "text-soligant-primary border-b-2 border-soligant-primary"
                    : "text-gray-500 hover:text-soligant-primary"
                }`}
                onClick={() => setSelectedTab("accessories")}
              >
                Phụ kiện
              </button>

              <button
                className={`px-4 py-3 font-utm-avo font-medium text-sm ${
                  selectedTab === "pets"
                    ? "text-soligant-primary border-b-2 border-soligant-primary"
                    : "text-gray-500 hover:text-soligant-primary"
                }`}
                onClick={() => setSelectedTab("pets")}
              >
                Thú cưng
              </button>

              <button
                className={`px-4 py-3 font-utm-avo font-medium text-sm ${
                  selectedTab === "combos"
                    ? "text-soligant-primary border-b-2 border-soligant-primary"
                    : "text-gray-500 hover:text-soligant-primary"
                }`}
                onClick={() => setSelectedTab("combos")}
              >
                Combo ưu đãi
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            {renderTabContent()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => navigate("/collections")}>
              Quay lại danh sách bộ sưu tập
            </Button>
            <Button variant="primary" onClick={handleProceedToBackground}>
              Tiếp tục - Tùy chỉnh background
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizePage;
