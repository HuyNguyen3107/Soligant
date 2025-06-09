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
import Modal from "../components/ui/Modal"; // Import Modal component

// Data
import {
  clothingColors,
  outfits,
  hairStyles,
  faceStyles,
  accessories,
  pets,
  fullCombo,
  accessoryCombo,
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
  addAdditionalAccessory,
  removeAdditionalAccessory,
  setAdditionalPet,
  setAccessoryCombo,
  removeAccessoryCombo,
  setFullCombo,
  removeFullCombo,
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
  const [selectedTab, setSelectedTab] = useState("version");
  const [activeComboSection, setActiveComboSection] = useState("fullCombo");
  const [genderFilter1, setGenderFilter1] = useState("all"); // Thêm filter giới tính cho nhân vật 1
  const [genderFilter2, setGenderFilter2] = useState("all"); // Thêm filter giới tính cho nhân vật 2

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

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

  // Function hiển thị modal xác nhận
  const openConfirmModal = (title, message, action) => {
    setModalTitle(title);
    setModalMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  // Function xử lý hành động confirm
  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
  };

  // Version data
  const versions = [
    {
      id: "version1",
      name: "Version 1",
      price: 245000,
      description: "Khung tranh bên trong có 01 LEGO",
      details: [
        "Tặng Box quà sang trọng",
        "Tặng Túi đựng xinh xắn",
        "Tặng Thiếp viết tay",
        "Khung tranh bên trong có 01 LEGO",
      ],
    },
    {
      id: "version2",
      name: "Version 2",
      price: 250000,
      description: "Khung tranh bên trong có 02 LEGO",
      details: [
        "Tặng Box quà sang trọng",
        "Tặng Túi đựng xinh xắn",
        "Tặng Thiếp viết tay",
        "Khung tranh bên trong có 02 LEGO",
      ],
    },
  ];

  // Handlers
  const handleVersionSelect = (versionId) => {
    // Nếu đã có combo trọn bộ, hiển thị cảnh báo
    if (customization.fullCombo) {
      openConfirmModal(
        "Xác nhận thay đổi",
        "Chọn phiên bản riêng sẽ hủy combo trọn bộ hiện tại. Bạn có chắc chắn muốn hủy combo?",
        () => {
          // Hủy combo trọn bộ
          dispatch(removeFullCombo());
          // Thiết lập version mới
          dispatch(setVersion(versionId));
          dispatch(recalculatePrice());
          setSelectedTab("character1");
        }
      );
    } else {
      // Trường hợp bình thường - không có combo
      dispatch(setVersion(versionId));
      dispatch(recalculatePrice());
      setSelectedTab("character1");
    }
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

  const handleOutfitSelect = (outfitId) => {
    dispatch(setOutfit(outfitId));
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

  // Xử lý phụ kiện, cho phép thêm ngay cả khi đã có trong combo
  const handleAccessoryToggle = (accessory) => {
    // Kiểm tra xem phụ kiện này có trong trọn bộ combo không
    const isInFullCombo =
      customization.fullCombo &&
      customization.fullCombo.includes?.accessories?.includes(accessory.id);

    // Nếu phụ kiện đã có trong combo trọn bộ, hiển thị thông báo
    if (isInFullCombo) {
      toast.info(`${accessory.name} đã có sẵn trong combo trọn bộ của bạn`);
      return;
    }

    // Cho phép chọn phụ kiện dù nó đã có trong combo phụ kiện
    // Chỉ kiểm tra xem phụ kiện đã thêm riêng chưa

    // Xử lý thêm/xóa phụ kiện bổ sung
    const existingAccessory = customization.additionalAccessories?.find(
      (acc) => acc.id === accessory.id
    );

    if (existingAccessory) {
      dispatch(removeAdditionalAccessory(accessory.id));
      dispatch(recalculatePrice()); // Đảm bảo tính lại giá
      toast.info(`Đã xóa ${accessory.name} khỏi giỏ hàng`);
    } else {
      dispatch(addAdditionalAccessory(accessory));
      dispatch(recalculatePrice()); // Đảm bảo tính lại giá
      toast.success(`Đã thêm ${accessory.name} vào giỏ hàng`);
    }
  };

  // Xử lý thú cưng, cho phép thêm ngay cả khi đã có combo
  const handlePetSelect = (pet) => {
    // Kiểm tra xem thú cưng đã có trong combo chưa
    const isInFullCombo =
      customization.fullCombo &&
      customization.fullCombo.includes?.pet === pet.id;

    // Nếu thú cưng đã có trong combo trọn bộ, hiển thị thông báo
    if (isInFullCombo) {
      toast.info(`${pet.name} đã có sẵn trong combo trọn bộ của bạn`);
      return;
    }

    // Cho phép chọn thú cưng dù đã có trong combo phụ kiện

    // Xử lý chọn/hủy thú cưng bổ sung
    if (
      customization.additionalPet &&
      customization.additionalPet.id === pet.id
    ) {
      dispatch(setAdditionalPet(null));
      dispatch(recalculatePrice()); // Đảm bảo tính lại giá
      toast.info(`Đã hủy chọn ${pet.name}`);
    } else {
      // Nếu đã chọn thú cưng khác, hiển thị thông báo
      if (customization.additionalPet) {
        openConfirmModal(
          "Xác nhận thay đổi thú cưng",
          `Bạn đã chọn ${customization.additionalPet.name}. Chọn ${pet.name} sẽ thay thế thú cưng đã chọn. Bạn có muốn tiếp tục?`,
          () => {
            dispatch(setAdditionalPet(pet));
            dispatch(recalculatePrice()); // Đảm bảo tính lại giá
            toast.success(`Đã chọn ${pet.name}`);
          }
        );
      } else {
        dispatch(setAdditionalPet(pet));
        dispatch(recalculatePrice()); // Đảm bảo tính lại giá
        toast.success(`Đã chọn ${pet.name}`);
      }
    }
  };

  // Xử lý accessory combo - Cập nhật theo yêu cầu mới
  const handleAccessoryComboToggle = (combo) => {
    if (customization.accessoryCombo?.id === combo.id) {
      // Hủy chọn nếu đã chọn combo này
      dispatch(removeAccessoryCombo());
      dispatch(recalculatePrice()); // Đảm bảo tính lại giá sau khi hủy
      toast.info(`Đã hủy combo ${combo.name}`);
    } else {
      // Nếu đang có combo phụ kiện khác
      if (customization.accessoryCombo) {
        openConfirmModal(
          "Xác nhận thay đổi combo phụ kiện",
          `Thay đổi combo phụ kiện từ "${customization.accessoryCombo.name}" sang "${combo.name}". Bạn có muốn tiếp tục?`,
          () => {
            dispatch(setAccessoryCombo(combo));
            dispatch(recalculatePrice()); // Đảm bảo tính lại giá
            toast.success(`Đã chọn combo ${combo.name}`);
          }
        );
        return;
      }

      // Không cần kiểm tra trùng lặp phụ kiện nữa vì phụ kiện trong combo và phụ kiện riêng có thể trùng nhau
      dispatch(setAccessoryCombo(combo));
      dispatch(recalculatePrice());
      toast.success(`Đã chọn combo ${combo.name}`);
    }
  };

  // Xử lý full combo
  const handleFullComboToggle = (combo) => {
    if (customization.fullCombo?.id === combo.id) {
      // Hủy chọn nếu đã chọn combo này
      dispatch(removeFullCombo());
      toast.info(`Đã hủy combo ${combo.name}`);
      dispatch(recalculatePrice());
    } else {
      let confirmNeeded = false;
      let message = "";

      // Nếu đang có combo trọn bộ khác
      if (customization.fullCombo) {
        confirmNeeded = true;
        message = `Thay đổi combo trọn bộ từ "${customization.fullCombo.name}" sang "${combo.name}". Bạn có muốn tiếp tục?`;
      }
      // Kiểm tra xem version hiện tại có khớp với version trong combo không
      else if (
        customization.version.selected &&
        customization.version.selected !== combo.includes.version
      ) {
        confirmNeeded = true;
        message = `Chọn combo này sẽ thay đổi phiên bản của bạn từ ${
          customization.version.selected === "version1"
            ? "Version 1"
            : "Version 2"
        } sang ${
          combo.includes.version === "version1" ? "Version 1" : "Version 2"
        }. Bạn có muốn tiếp tục?`;
      }

      if (confirmNeeded) {
        openConfirmModal("Xác nhận thay đổi combo", message, () => {
          dispatch(setFullCombo(combo));
          dispatch(recalculatePrice());
          toast.success(`Đã chọn combo ${combo.name}`);
        });
      } else {
        dispatch(setFullCombo(combo));
        dispatch(recalculatePrice());
        toast.success(`Đã chọn combo ${combo.name}`);
      }
    }
  };

  const handleProceedToBackground = () => {
    // Validation
    if (!customization.version.selected && !customization.fullCombo) {
      toast.warning("Vui lòng chọn phiên bản sản phẩm hoặc combo trọn bộ");
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

    if (
      !customization.characters.character1.hair &&
      !customization.fullCombo?.includes?.hair
    ) {
      toast.warning("Vui lòng chọn kiểu tóc cho nhân vật 1");
      setSelectedTab("character1");
      return;
    }

    // Nếu là version 2 hoặc combo có 2 nhân vật
    const isVersion2 =
      customization.version.selected === "version2" ||
      customization.fullCombo?.includes?.version === "version2";

    if (isVersion2) {
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

      if (
        !customization.characters.character2.hair &&
        !customization.fullCombo?.includes?.hair
      ) {
        toast.warning("Vui lòng chọn kiểu tóc cho nhân vật 2");
        setSelectedTab("character2");
        return;
      }
    }

    // Điều hướng đến trang background
    dispatch(setCurrentStep("background"));
    navigate(`/collections/${collectionId}/background`);
  };

  // Hàm kiểm tra xem một item cụ thể có nằm trong combo trọn bộ không
  const isItemInFullCombo = (itemId) => {
    // Kiểm tra trong combo trọn bộ
    if (customization.fullCombo?.includes?.accessories?.includes(itemId)) {
      return true;
    }
    return false;
  };

  // Hàm kiểm tra xem một item cụ thể có nằm trong combo phụ kiện không
  const isItemInAccessoryCombo = (itemId) => {
    // Kiểm tra trong combo phụ kiện
    if (customization.accessoryCombo?.includes?.includes(itemId)) {
      return true;
    }
    return false;
  };

  // Hàm lấy giá version hiện tại
  const getCurrentVersionPrice = () => {
    if (customization.version.selected === "version1") {
      return 245000;
    } else if (customization.version.selected === "version2") {
      return 250000;
    }
    return 0;
  };

  // Hàm lấy thông tin tóc từ combo
  const getHairInfoFromCombo = (characterNumber) => {
    if (!customization.fullCombo?.includes?.hair) return null;

    // Lấy tóc đã chọn cho nhân vật cụ thể
    const selectedHair =
      characterNumber === 1
        ? customization.characters.character1.hair
        : customization.characters.character2.hair;

    if (selectedHair) {
      // Nếu đã chọn tóc cụ thể, hiển thị tên tóc và thông báo từ combo
      return {
        name: selectedHair.name,
        fromCombo: true,
      };
    } else {
      // Nếu chưa chọn tóc cụ thể nhưng có trong combo
      return {
        name: "Chưa chọn",
        fromCombo: true,
      };
    }
  };

  // Hàm lọc tóc theo giới tính cho nhân vật
  const filterHairsByGender = (gender) => {
    if (gender === "all") {
      return hairStyles;
    } else {
      return hairStyles.filter(
        (hair) => hair.gender === gender || hair.gender === "both"
      );
    }
  };

  // Hàm lọc mặt theo giới tính cho nhân vật
  const filterFacesByGender = (gender) => {
    if (gender === "all") {
      return faceStyles;
    } else {
      return faceStyles.filter(
        (face) => face.gender === gender || face.gender === "both"
      );
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (selectedTab) {
      case "version":
        return (
          <VersionSelector
            versions={versions}
            selectedVersion={
              customization.fullCombo
                ? customization.fullCombo.includes.version
                : customization.version.selected
            }
            onSelectVersion={handleVersionSelect}
            disabled={!!customization.fullCombo}
            noticeText={
              customization.fullCombo
                ? "Phiên bản đã được bao gồm trong combo trọn bộ. Để thay đổi phiên bản, vui lòng hủy combo trước."
                : null
            }
          />
        );

      case "character1":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 font-utm-avo">
              Tùy chỉnh Nhân vật 1 (Bên trái)
            </h2>

            {/* Tab lọc giới tính */}
            <div className="mb-6 flex items-center">
              <span className="mr-3 font-utm-avo text-sm">Giới tính:</span>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded-full font-utm-avo transition-colors ${
                    genderFilter1 === "all"
                      ? "bg-soligant-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setGenderFilter1("all")}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-full font-utm-avo transition-colors ${
                    genderFilter1 === "female"
                      ? "bg-soligant-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setGenderFilter1("female")}
                >
                  Nữ
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-full font-utm-avo transition-colors ${
                    genderFilter1 === "male"
                      ? "bg-soligant-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setGenderFilter1("male")}
                >
                  Nam
                </button>
              </div>
            </div>

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
              <h3 className="text-xl font-bold mb-4 font-utm-avo">
                Outfit mẫu tham khảo
              </h3>
              <p className="text-sm text-gray-600 mb-4 font-utm-avo">
                Đây là các mẫu phối màu gợi ý. Bạn có thể xem và tự chọn màu
                quần áo theo ý thích.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {outfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="aspect-square mb-2 bg-white rounded overflow-hidden">
                      <img
                        src={outfit.imageUrl}
                        alt={outfit.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-sm mb-1 font-utm-avo">
                      {outfit.name}
                    </h4>
                    <p className="text-xs text-gray-600 font-utm-avo">
                      {outfit.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-500 font-utm-avo">
                          Áo:
                        </span>
                        <div
                          className="w-4 h-4 inline-block ml-1 border border-gray-300"
                          style={{ backgroundColor: outfit.topColor.colorCode }}
                          title={outfit.topColor.name}
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-500 font-utm-avo">
                          Quần:
                        </span>
                        <div
                          className="w-4 h-4 inline-block ml-1 border border-gray-300"
                          style={{
                            backgroundColor: outfit.bottomColor.colorCode,
                          }}
                          title={outfit.bottomColor.name}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kiểu tóc */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={filterHairsByGender(genderFilter1)}
                selectedItemId={customization.characters.character1.hair?.id}
                onSelectItem={handleHairSelect}
                title="Chọn kiểu tóc"
                itemPrice={true}
                itemsPerRow={4}
                disabled={!!customization.fullCombo?.includes?.hair}
                noticeText={
                  customization.fullCombo?.includes?.hair
                    ? "Kiểu tóc đã được bao gồm trong combo trọn bộ. Bạn vẫn nên chọn kiểu tóc để hiển thị chính xác."
                    : null
                }
              />
            </div>

            {/* Kiểu mặt */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={filterFacesByGender(genderFilter1)}
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

            {/* Tab lọc giới tính */}
            <div className="mb-6 flex items-center">
              <span className="mr-3 font-utm-avo text-sm">Giới tính:</span>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded-full font-utm-avo transition-colors ${
                    genderFilter2 === "all"
                      ? "bg-soligant-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setGenderFilter2("all")}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-full font-utm-avo transition-colors ${
                    genderFilter2 === "female"
                      ? "bg-soligant-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setGenderFilter2("female")}
                >
                  Nữ
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-full font-utm-avo transition-colors ${
                    genderFilter2 === "male"
                      ? "bg-soligant-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setGenderFilter2("male")}
                >
                  Nam
                </button>
              </div>
            </div>

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
                items={filterHairsByGender(genderFilter2)}
                selectedItemId={customization.characters.character2.hair?.id}
                onSelectItem={handleHairSelect}
                title="Chọn kiểu tóc"
                itemPrice={true}
                itemsPerRow={4}
                disabled={!!customization.fullCombo?.includes?.hair}
                noticeText={
                  customization.fullCombo?.includes?.hair
                    ? "Kiểu tóc đã được bao gồm trong combo trọn bộ. Bạn vẫn nên chọn kiểu tóc để hiển thị chính xác."
                    : null
                }
              />
            </div>

            {/* Kiểu mặt */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={filterFacesByGender(genderFilter2)}
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
                selectedItemId={[
                  ...(customization.additionalAccessories?.map(
                    (acc) => acc.id
                  ) || []),
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInFullCombo(acc.id) &&
                        (acc.type === "bag" || acc.type === "device")
                    )
                    .map((acc) => acc.id),
                ]}
                onSelectItem={handleAccessoryToggle}
                title="Túi xách & Thiết bị"
                multiple={true}
                itemPrice={true}
                itemsPerRow={4}
                highlightComboItems={true}
                comboItems={[
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInFullCombo(acc.id) &&
                        (acc.type === "bag" || acc.type === "device")
                    )
                    .map((acc) => acc.id),
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInAccessoryCombo(acc.id) &&
                        (acc.type === "bag" || acc.type === "device")
                    )
                    .map((acc) => acc.id),
                ]}
              />
            </div>

            {/* Phụ kiện đồ ăn */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={accessories.filter((acc) => acc.type === "food")}
                selectedItemId={[
                  ...(customization.additionalAccessories?.map(
                    (acc) => acc.id
                  ) || []),
                  ...accessories
                    .filter(
                      (acc) => isItemInFullCombo(acc.id) && acc.type === "food"
                    )
                    .map((acc) => acc.id),
                ]}
                onSelectItem={handleAccessoryToggle}
                title="Đồ ăn"
                multiple={true}
                itemPrice={true}
                itemsPerRow={4}
                highlightComboItems={true}
                comboItems={[
                  ...accessories
                    .filter(
                      (acc) => isItemInFullCombo(acc.id) && acc.type === "food"
                    )
                    .map((acc) => acc.id),
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInAccessoryCombo(acc.id) && acc.type === "food"
                    )
                    .map((acc) => acc.id),
                ]}
              />
            </div>

            {/* Phụ kiện hoa */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={accessories.filter((acc) => acc.type === "flower")}
                selectedItemId={[
                  ...(customization.additionalAccessories?.map(
                    (acc) => acc.id
                  ) || []),
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInFullCombo(acc.id) && acc.type === "flower"
                    )
                    .map((acc) => acc.id),
                ]}
                onSelectItem={handleAccessoryToggle}
                title="Hoa"
                multiple={true}
                itemPrice={true}
                itemsPerRow={4}
                highlightComboItems={true}
                comboItems={[
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInFullCombo(acc.id) && acc.type === "flower"
                    )
                    .map((acc) => acc.id),
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInAccessoryCombo(acc.id) && acc.type === "flower"
                    )
                    .map((acc) => acc.id),
                ]}
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
                selectedItemId={[
                  ...(customization.additionalAccessories?.map(
                    (acc) => acc.id
                  ) || []),
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInFullCombo(acc.id) &&
                        acc.type !== "bag" &&
                        acc.type !== "device" &&
                        acc.type !== "food" &&
                        acc.type !== "flower"
                    )
                    .map((acc) => acc.id),
                ]}
                onSelectItem={handleAccessoryToggle}
                title="Phụ kiện khác"
                multiple={true}
                itemPrice={true}
                itemsPerRow={4}
                highlightComboItems={true}
                comboItems={[
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInFullCombo(acc.id) &&
                        acc.type !== "bag" &&
                        acc.type !== "device" &&
                        acc.type !== "food" &&
                        acc.type !== "flower"
                    )
                    .map((acc) => acc.id),
                  ...accessories
                    .filter(
                      (acc) =>
                        isItemInAccessoryCombo(acc.id) &&
                        acc.type !== "bag" &&
                        acc.type !== "device" &&
                        acc.type !== "food" &&
                        acc.type !== "flower"
                    )
                    .map((acc) => acc.id),
                ]}
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

            {/* Thông báo nếu có thú cưng trong combo */}
            {(customization.fullCombo?.includes?.pet ||
              customization.accessoryCombo?.includes?.pet) && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-utm-avo text-yellow-700">
                  <span className="font-bold">🐾 Lưu ý:</span> Thú cưng đã được
                  bao gồm trong combo của bạn. Nếu bạn chọn thú cưng khác, thú
                  cưng mới sẽ được tính thêm vào đơn hàng.
                </p>
              </div>
            )}

            {/* Mèo */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={pets.filter((pet) => pet.type === "cat")}
                selectedItemId={[
                  customization.additionalPet?.id,
                  ...(customization.fullCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.fullCombo.includes.pet
                  )?.type === "cat"
                    ? [customization.fullCombo.includes.pet]
                    : []),
                  ...(customization.accessoryCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.accessoryCombo.includes.pet
                  )?.type === "cat"
                    ? [customization.accessoryCombo.includes.pet]
                    : []),
                ].filter(Boolean)} // Filter falsy values
                onSelectItem={handlePetSelect}
                title="Mèo"
                itemPrice={true}
                itemsPerRow={4}
                multiple={false}
                highlightComboItems={true}
                comboItems={[
                  ...(customization.fullCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.fullCombo.includes.pet
                  )?.type === "cat"
                    ? [customization.fullCombo.includes.pet]
                    : []),
                  ...(customization.accessoryCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.accessoryCombo.includes.pet
                  )?.type === "cat"
                    ? [customization.accessoryCombo.includes.pet]
                    : []),
                ]}
              />
            </div>

            {/* Chó */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={pets.filter((pet) => pet.type === "dog")}
                selectedItemId={[
                  customization.additionalPet?.id,
                  ...(customization.fullCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.fullCombo.includes.pet
                  )?.type === "dog"
                    ? [customization.fullCombo.includes.pet]
                    : []),
                  ...(customization.accessoryCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.accessoryCombo.includes.pet
                  )?.type === "dog"
                    ? [customization.accessoryCombo.includes.pet]
                    : []),
                ].filter(Boolean)}
                onSelectItem={handlePetSelect}
                title="Chó"
                itemPrice={true}
                itemsPerRow={4}
                multiple={false}
                highlightComboItems={true}
                comboItems={[
                  ...(customization.fullCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.fullCombo.includes.pet
                  )?.type === "dog"
                    ? [customization.fullCombo.includes.pet]
                    : []),
                  ...(customization.accessoryCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.accessoryCombo.includes.pet
                  )?.type === "dog"
                    ? [customization.accessoryCombo.includes.pet]
                    : []),
                ]}
              />
            </div>

            {/* Các thú cưng khác */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <ProductOptionSelector
                items={pets.filter(
                  (pet) => pet.type !== "cat" && pet.type !== "dog"
                )}
                selectedItemId={[
                  customization.additionalPet?.id,
                  ...(customization.fullCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.fullCombo.includes.pet
                  )?.type !== "cat" &&
                  pets.find(
                    (p) => p.id === customization.fullCombo.includes.pet
                  )?.type !== "dog"
                    ? [customization.fullCombo.includes.pet]
                    : []),
                  ...(customization.accessoryCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.accessoryCombo.includes.pet
                  )?.type !== "cat" &&
                  pets.find(
                    (p) => p.id === customization.accessoryCombo.includes.pet
                  )?.type !== "dog"
                    ? [customization.accessoryCombo.includes.pet]
                    : []),
                ].filter(Boolean)}
                onSelectItem={handlePetSelect}
                title="Các thú cưng khác"
                itemPrice={true}
                itemsPerRow={4}
                multiple={false}
                highlightComboItems={true}
                comboItems={[
                  ...(customization.fullCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.fullCombo.includes.pet
                  )?.type !== "cat" &&
                  pets.find(
                    (p) => p.id === customization.fullCombo.includes.pet
                  )?.type !== "dog"
                    ? [customization.fullCombo.includes.pet]
                    : []),
                  ...(customization.accessoryCombo?.includes?.pet &&
                  pets.find(
                    (p) => p.id === customization.accessoryCombo.includes.pet
                  )?.type !== "cat" &&
                  pets.find(
                    (p) => p.id === customization.accessoryCombo.includes.pet
                  )?.type !== "dog"
                    ? [customization.accessoryCombo.includes.pet]
                    : []),
                ]}
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

            {/* Tab để chọn loại combo */}
            <div className="mb-6 border-b border-gray-200">
              <div className="flex">
                <div className="mr-3">
                  <button
                    onClick={() => setActiveComboSection("fullCombo")}
                    className={`px-6 py-3 font-utm-avo font-medium rounded-t-lg border-2 transition-all ${
                      activeComboSection === "fullCombo"
                        ? "bg-green-50 text-green-800 border-green-200 border-b-0"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    Combo trọn bộ
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setActiveComboSection("accessoryCombo")}
                    className={`px-6 py-3 font-utm-avo font-medium rounded-t-lg border-2 transition-all ${
                      activeComboSection === "accessoryCombo"
                        ? "bg-blue-50 text-blue-800 border-blue-200 border-b-0"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    Combo phụ kiện
                  </button>
                </div>
              </div>
            </div>

            {/* Full Combo Options */}
            {activeComboSection === "fullCombo" && (
              <div
                id="fullComboSection"
                className="mb-10 p-6 bg-green-50 rounded-lg border-2 border-green-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 font-utm-avo">
                    Combo trọn bộ
                  </h3>
                </div>

                <div className="mb-4 p-4 bg-white rounded-lg border border-green-300">
                  <p className="text-green-800 font-utm-avo">
                    <span className="font-bold">💎 Combo trọn bộ:</span> Bao gồm
                    bản thân khung tranh có LEGO và các phụ kiện đi kèm. Tiết
                    kiệm hơn so với mua từng sản phẩm riêng lẻ.
                  </p>
                </div>

                <div className="space-y-4">
                  {fullCombo.map((combo) => (
                    <div
                      key={combo.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        customization.fullCombo?.id === combo.id
                          ? "border-green-500 bg-white"
                          : "border-green-300 bg-white hover:border-green-400"
                      }`}
                      onClick={() => handleFullComboToggle(combo)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-green-700 mb-2 font-utm-avo flex items-center">
                            {combo.name}
                            {customization.fullCombo?.id === combo.id && (
                              <span className="ml-2 inline-flex items-center justify-center bg-green-600 text-white w-6 h-6 text-sm rounded-full">
                                ✓
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 font-utm-avo">
                            {combo.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-lg font-bold text-green-700 font-utm-avo">
                              {new Intl.NumberFormat("vi-VN").format(
                                combo.price
                              )}{" "}
                              VNĐ
                            </span>
                            <span className="text-sm text-gray-500 line-through font-utm-avo">
                              {new Intl.NumberFormat("vi-VN").format(
                                combo.originalPrice
                              )}{" "}
                              VNĐ
                            </span>
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-utm-avo">
                              Tiết kiệm{" "}
                              {new Intl.NumberFormat("vi-VN").format(
                                combo.originalPrice - combo.price
                              )}{" "}
                              VNĐ
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <img
                            src={combo.imageUrl}
                            alt={combo.name}
                            className="w-24 h-20 object-cover rounded"
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-sm bg-green-50 p-2 rounded text-green-800 font-utm-avo">
                        <span className="font-bold">Bao gồm:</span>{" "}
                        {combo.includesText}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accessory Combo */}
            {activeComboSection === "accessoryCombo" && (
              <div
                id="accessoryComboSection"
                className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 font-utm-avo">
                    Combo phụ kiện
                  </h3>
                </div>

                <div className="mb-4 p-4 bg-white rounded-lg border border-blue-300">
                  <p className="text-blue-800 font-utm-avo">
                    <span className="font-bold">🎁 Combo phụ kiện:</span> Kết
                    hợp các phụ kiện và thú cưng phổ biến với giá ưu đãi. Bạn
                    vẫn cần chọn phiên bản sản phẩm riêng.
                  </p>
                </div>

                <div className="space-y-4">
                  {accessoryCombo.map((combo) => (
                    <div
                      key={combo.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        customization.accessoryCombo?.id === combo.id
                          ? "border-blue-500 bg-white"
                          : "border-blue-300 bg-white hover:border-blue-400"
                      }`}
                      onClick={() => handleAccessoryComboToggle(combo)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-blue-700 mb-2 font-utm-avo flex items-center">
                            {combo.name}
                            {customization.accessoryCombo?.id === combo.id && (
                              <span className="ml-2 inline-flex items-center justify-center bg-blue-600 text-white w-6 h-6 text-sm rounded-full">
                                ✓
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 font-utm-avo">
                            {combo.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-lg font-bold text-blue-700 font-utm-avo">
                              {new Intl.NumberFormat("vi-VN").format(
                                combo.price
                              )}{" "}
                              VNĐ
                            </span>
                            <span className="text-sm text-gray-500 line-through font-utm-avo">
                              {new Intl.NumberFormat("vi-VN").format(
                                combo.originalPrice
                              )}{" "}
                              VNĐ
                            </span>
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-utm-avo">
                              Tiết kiệm{" "}
                              {new Intl.NumberFormat("vi-VN").format(
                                combo.originalPrice - combo.price
                              )}{" "}
                              VNĐ
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <img
                            src={combo.imageUrl}
                            alt={combo.name}
                            className="w-20 h-16 object-cover rounded"
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-sm bg-blue-50 p-2 rounded text-blue-800 font-utm-avo">
                        <span className="font-bold">Bao gồm:</span>{" "}
                        {combo.includesText}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hướng dẫn chọn combo phù hợp */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold mb-2 font-utm-avo">
                💡 Hướng dẫn chọn combo
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li className="font-utm-avo text-sm">
                  <span className="font-bold text-green-700">
                    Combo trọn bộ:
                  </span>{" "}
                  Bao gồm cả khung tranh và phụ kiện, tiết kiệm hơn so với mua
                  lẻ.
                </li>
                <li className="font-utm-avo text-sm">
                  <span className="font-bold text-blue-700">
                    Combo phụ kiện:
                  </span>{" "}
                  Bạn vẫn cần chọn phiên bản sản phẩm, combo này chỉ bao gồm phụ
                  kiện.
                </li>
                <li className="font-utm-avo text-sm">
                  <span className="font-bold">Thú cưng & Phụ kiện:</span> Bạn
                  luôn có thể thêm phụ kiện và thú cưng riêng ngoài combo.
                </li>
                <li className="font-utm-avo text-sm">
                  <span className="font-bold">Đổi combo:</span> Khi đổi combo,
                  các thông tin hiện tại vẫn được giữ lại.
                </li>
              </ul>
            </div>
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
  const showCharacter2Tab =
    customization.version?.selected === "version2" ||
    customization.fullCombo?.includes?.version === "version2";

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

  // Lấy thông tin tóc từ combo hoặc đã chọn cho character 1 và 2
  const hair1Info = getHairInfoFromCombo(1);
  const hair2Info = getHairInfoFromCombo(2);

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

            {/* Full combo - hiển thị nếu đã chọn */}
            {customization.fullCombo && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-green-700 mb-1 font-utm-avo">
                  Combo trọn bộ:
                </h3>
                <p className="font-utm-avo text-green-700">
                  {customization.fullCombo.name}
                </p>
                <div className="mt-2 text-xs text-gray-600 font-utm-avo">
                  <p>
                    <span className="font-semibold">Bao gồm:</span>{" "}
                    {customization.fullCombo.includesText}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-green-800 font-bold font-utm-avo">
                    {new Intl.NumberFormat("vi-VN").format(
                      customization.fullCombo.price
                    )}{" "}
                    VNĐ
                  </span>
                  <button
                    onClick={() =>
                      handleFullComboToggle(customization.fullCombo)
                    }
                    className="text-xs text-red-500 hover:text-red-700 font-utm-avo"
                  >
                    Hủy combo
                  </button>
                </div>
              </div>
            )}

            {/* Version - hiển thị nếu không có full combo hoặc nếu có full combo thì hiển thị thông tin về version đi kèm */}
            <div className="mb-4">
              <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                Phiên bản:
              </h3>
              {customization.fullCombo ? (
                <p className="font-utm-avo flex items-center">
                  {customization.fullCombo.includes.version === "version1"
                    ? "Version 1 - Khung tranh có 01 LEGO"
                    : "Version 2 - Khung tranh có 02 LEGO"}
                  <span className="inline-block ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Từ combo
                  </span>
                </p>
              ) : (
                <p className="font-utm-avo">
                  {customization.version?.selected === "version1"
                    ? "Version 1 - Khung tranh có 01 LEGO"
                    : customization.version?.selected === "version2"
                    ? "Version 2 - Khung tranh có 02 LEGO"
                    : "Chưa chọn"}
                </p>
              )}
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
                  {hair1Info ? (
                    <span className="flex items-center">
                      {hair1Info.name}
                      {hair1Info.fromCombo && (
                        <span className="inline-block ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Từ combo
                        </span>
                      )}
                    </span>
                  ) : customization.characters.character1.hair ? (
                    customization.characters.character1.hair.name
                  ) : (
                    "Chưa chọn"
                  )}
                </li>
                <li className="font-utm-avo">
                  Kiểu mặt:{" "}
                  {customization.characters.character1.face?.name ||
                    "Chưa chọn"}
                </li>
              </ul>
            </div>

            {/* Nhân vật 2 - chỉ hiển thị khi chọn version 2 hoặc combo có version 2 */}
            {showCharacter2Tab && (
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
                    {hair2Info ? (
                      <span className="flex items-center">
                        {hair2Info.name}
                        {hair2Info.fromCombo && (
                          <span className="inline-block ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Từ combo
                          </span>
                        )}
                      </span>
                    ) : customization.characters.character2.hair ? (
                      customization.characters.character2.hair.name
                    ) : (
                      "Chưa chọn"
                    )}
                  </li>
                  <li className="font-utm-avo">
                    Kiểu mặt:{" "}
                    {customization.characters.character2.face?.name ||
                      "Chưa chọn"}
                  </li>
                </ul>
              </div>
            )}

            {/* Accessory Combo - hiển thị nếu đã chọn */}
            {customization.accessoryCombo && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-blue-700 mb-1 font-utm-avo">
                  Combo phụ kiện:
                </h3>
                <p className="font-utm-avo text-blue-700">
                  {customization.accessoryCombo.name}
                </p>
                <div className="mt-2 text-xs text-gray-600 font-utm-avo">
                  <p>
                    <span className="font-semibold">Bao gồm:</span>{" "}
                    {customization.accessoryCombo.includesText}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-blue-800 font-bold font-utm-avo">
                    {new Intl.NumberFormat("vi-VN").format(
                      customization.accessoryCombo.price
                    )}{" "}
                    VNĐ
                  </span>
                  <button
                    onClick={() =>
                      handleAccessoryComboToggle(customization.accessoryCombo)
                    }
                    className="text-xs text-red-500 hover:text-red-700 font-utm-avo"
                  >
                    Hủy combo
                  </button>
                </div>
              </div>
            )}

            {/* Phụ kiện thêm - hiển thị chi tiết từng phụ kiện */}
            {customization.additionalAccessories?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Phụ kiện thêm:
                </h3>
                <ul className="pl-4 list-disc">
                  {customization.additionalAccessories.map((acc) => (
                    <li key={acc.id} className="font-utm-avo">
                      {acc.name} (+
                      {new Intl.NumberFormat("vi-VN").format(acc.price)} VNĐ)
                      <button
                        onClick={() => handleAccessoryToggle(acc)}
                        className="ml-2 text-xs text-red-500 hover:text-red-700"
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Phụ kiện từ combo trọn bộ - hiển thị chi tiết phụ kiện từ combo */}
            {customization.fullCombo?.includes?.accessories?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Phụ kiện từ combo trọn bộ:
                </h3>
                <ul className="pl-4 list-disc">
                  {accessories
                    .filter((acc) =>
                      customization.fullCombo?.includes?.accessories?.includes(
                        acc.id
                      )
                    )
                    .map((acc) => (
                      <li
                        key={acc.id}
                        className="font-utm-avo flex items-center"
                      >
                        {acc.name}
                        <span className="inline-block ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Từ combo
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Phụ kiện từ combo phụ kiện - hiển thị chi tiết phụ kiện từ combo phụ kiện */}
            {customization.accessoryCombo?.includes?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Phụ kiện từ combo phụ kiện:
                </h3>
                <ul className="pl-4 list-disc">
                  {accessories
                    .filter((acc) =>
                      customization.accessoryCombo?.includes?.includes(acc.id)
                    )
                    .map((acc) => (
                      <li
                        key={acc.id}
                        className="font-utm-avo flex items-center"
                      >
                        {acc.name}
                        <span className="inline-block ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Từ combo phụ kiện
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Thú cưng từ combo trọn bộ - hiển thị chi tiết nếu có */}
            {customization.fullCombo?.includes?.pet && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Thú cưng từ combo trọn bộ:
                </h3>
                <p className="font-utm-avo flex items-center pl-4">
                  {pets.find(
                    (p) => p.id === customization.fullCombo?.includes?.pet
                  )?.name || "Chưa chọn cụ thể"}
                  <span className="inline-block ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Từ combo
                  </span>
                </p>
              </div>
            )}

            {/* Thú cưng từ combo phụ kiện - hiển thị chi tiết nếu có */}
            {customization.accessoryCombo?.includes?.pet && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Thú cưng từ combo phụ kiện:
                </h3>
                <p className="font-utm-avo flex items-center pl-4">
                  {pets.find(
                    (p) => p.id === customization.accessoryCombo?.includes?.pet
                  )?.name || "Chưa chọn cụ thể"}
                  <span className="inline-block ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Từ combo phụ kiện
                  </span>
                </p>
              </div>
            )}

            {/* Thú cưng thêm */}
            {customization.additionalPet && (
              <div className="mb-4">
                <h3 className="font-bold text-soligant-primary mb-1 font-utm-avo">
                  Thú cưng thêm:
                </h3>
                <p className="font-utm-avo flex items-center">
                  {customization.additionalPet.name}
                  <span className="mx-1">
                    (+
                    {new Intl.NumberFormat("vi-VN").format(
                      customization.additionalPet.price
                    )}{" "}
                    VNĐ)
                  </span>
                  <button
                    onClick={() => handlePetSelect(customization.additionalPet)}
                    className="ml-1 text-xs text-red-500 hover:text-red-700"
                  >
                    x
                  </button>
                </p>
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

              {/* Chi tiết tính tiền */}
              <div className="text-xs text-gray-600 mt-2 space-y-1">
                {customization.fullCombo ? (
                  <p className="font-utm-avo">
                    Combo trọn bộ:{" "}
                    {new Intl.NumberFormat("vi-VN").format(
                      customization.fullCombo.price
                    )}{" "}
                    VNĐ
                  </p>
                ) : (
                  <p className="font-utm-avo">
                    Phiên bản:{" "}
                    {new Intl.NumberFormat("vi-VN").format(
                      getCurrentVersionPrice()
                    )}{" "}
                    VNĐ
                  </p>
                )}

                {customization.accessoryCombo && (
                  <p className="font-utm-avo">
                    Combo phụ kiện: +
                    {new Intl.NumberFormat("vi-VN").format(
                      customization.accessoryCombo.price
                    )}{" "}
                    VNĐ
                  </p>
                )}

                {customization.additionalAccessories?.length > 0 && (
                  <p className="font-utm-avo">
                    Phụ kiện thêm: +
                    {new Intl.NumberFormat("vi-VN").format(
                      customization.additionalAccessories.reduce(
                        (sum, acc) => sum + (acc.price || 0),
                        0
                      )
                    )}{" "}
                    VNĐ
                  </p>
                )}

                {customization.additionalPet && (
                  <p className="font-utm-avo">
                    Thú cưng thêm: +
                    {new Intl.NumberFormat("vi-VN").format(
                      customization.additionalPet.price
                    )}{" "}
                    VNĐ
                  </p>
                )}

                {!customization.fullCombo?.includes?.hair &&
                  customization.characters.character1.hair && (
                    <p className="font-utm-avo">
                      Tóc nhân vật 1: +
                      {new Intl.NumberFormat("vi-VN").format(
                        customization.characters.character1.hair.price || 0
                      )}{" "}
                      VNĐ
                    </p>
                  )}

                {showCharacter2Tab &&
                  !customization.fullCombo?.includes?.hair &&
                  customization.characters.character2.hair && (
                    <p className="font-utm-avo">
                      Tóc nhân vật 2: +
                      {new Intl.NumberFormat("vi-VN").format(
                        customization.characters.character2.hair.price || 0
                      )}{" "}
                      VNĐ
                    </p>
                  )}
              </div>

              <p className="text-sm text-gray-500 italic font-utm-avo mt-2">
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

      {/* Modal xác nhận */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={modalTitle}
      >
        <div className="mb-6">
          <p className="text-gray-700 font-utm-avo">{modalMessage}</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirmAction}>
            Xác nhận
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductCustomizePage;
