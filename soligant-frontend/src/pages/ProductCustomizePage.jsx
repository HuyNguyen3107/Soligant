import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Components
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import ColorPicker from "../components/ui/ColorPicker";
import OutfitPicker from "../components/ui/OutfitPicker";
import ItemSelector from "../components/ui/ItemSelector";

// Redux actions
import {
  setCollection,
  setTopColor,
  setBottomColor,
  setOutfit,
  setFace,
  setHair,
  addAccessory,
  removeAccessory,
  setPet,
  setCurrentStep,
} from "../redux/features/customizationSlice";

const ProductCustomizePage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [loading, setLoading] = useState(true);
  const [collection, setCollectionData] = useState(null);
  const [error, setError] = useState(null);

  // Redux state
  const customization = useSelector((state) => state.customization);

  // Mock data - sẽ thay thế bằng dữ liệu từ API sau
  const mockColorOptions = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#000000",
    "#FFFFFF",
    "#FF9900",
    "#9900FF",
    "#009900",
    "#990000",
    "#000099",
    "#999900",
    "#909090",
  ];

  const mockOutfits = [
    {
      id: "vintage",
      name: "Vintage",
      imageUrl: "https://via.placeholder.com/150?text=Vintage",
    },
    {
      id: "casual",
      name: "Cá tính",
      imageUrl: "https://via.placeholder.com/150?text=Casual",
    },
    {
      id: "pastel",
      name: "Pastel",
      imageUrl: "https://via.placeholder.com/150?text=Pastel",
    },
  ];

  const mockHairs = [
    {
      id: "hair1",
      name: "Tóc dài",
      imageUrl: "https://via.placeholder.com/150?text=Hair1",
    },
    {
      id: "hair2",
      name: "Tóc ngắn",
      imageUrl: "https://via.placeholder.com/150?text=Hair2",
    },
    {
      id: "hair3",
      name: "Tóc xoăn",
      imageUrl: "https://via.placeholder.com/150?text=Hair3",
    },
    {
      id: "hair4",
      name: "Tóc thẳng",
      imageUrl: "https://via.placeholder.com/150?text=Hair4",
    },
  ];

  const mockFaces = [
    {
      id: "face1",
      name: "Mặt cười",
      imageUrl: "https://via.placeholder.com/150?text=Face1",
    },
    {
      id: "face2",
      name: "Mặt nghiêm túc",
      imageUrl: "https://via.placeholder.com/150?text=Face2",
    },
    {
      id: "face3",
      name: "Mặt ngạc nhiên",
      imageUrl: "https://via.placeholder.com/150?text=Face3",
    },
  ];

  const mockAccessories = [
    {
      id: "acc1",
      name: "Kính",
      imageUrl: "https://via.placeholder.com/150?text=Glasses",
    },
    {
      id: "acc2",
      name: "Mũ",
      imageUrl: "https://via.placeholder.com/150?text=Hat",
    },
    {
      id: "acc3",
      name: "Túi",
      imageUrl: "https://via.placeholder.com/150?text=Bag",
    },
    {
      id: "acc4",
      name: "Đồng hồ",
      imageUrl: "https://via.placeholder.com/150?text=Watch",
    },
  ];

  const mockPets = [
    {
      id: "pet1",
      name: "Mèo",
      imageUrl: "https://via.placeholder.com/150?text=Cat",
    },
    {
      id: "pet2",
      name: "Chó",
      imageUrl: "https://via.placeholder.com/150?text=Dog",
    },
    {
      id: "pet3",
      name: "Không có",
      imageUrl: "https://via.placeholder.com/150?text=None",
    },
  ];

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
            name: "DEAR YOU",
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

  // Handlers
  const handleTopColorChange = (color) => {
    dispatch(setTopColor(color));
  };

  const handleBottomColorChange = (color) => {
    dispatch(setBottomColor(color));
  };

  const handleOutfitSelect = (outfitId) => {
    dispatch(setOutfit(outfitId));
  };

  const handleHairSelect = (hair) => {
    dispatch(setHair(hair.id));
  };

  const handleFaceSelect = (face) => {
    dispatch(setFace(face.id));
  };

  const handleAccessorySelect = (accessory) => {
    // Toggle accessory
    const isAlreadySelected =
      customization.productSelections.accessories.includes(accessory.id);

    if (isAlreadySelected) {
      dispatch(removeAccessory(accessory.id));
    } else {
      dispatch(addAccessory(accessory.id));
    }
  };

  const handlePetSelect = (pet) => {
    dispatch(setPet(pet.id));
  };

  const handleProceedToBackground = () => {
    // Validate nếu cần
    if (
      !customization.productSelections.clothing.topColor ||
      !customization.productSelections.clothing.bottomColor
    ) {
      toast.warning("Vui lòng chọn màu áo và quần");
      return;
    }

    if (!customization.productSelections.face) {
      toast.warning("Vui lòng chọn kiểu mặt");
      return;
    }

    if (!customization.productSelections.hair) {
      toast.warning("Vui lòng chọn kiểu tóc");
      return;
    }

    // Điều hướng đến trang background
    dispatch(setCurrentStep("background"));
    navigate(`/collections/${collectionId}/background`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <Loading size="large" />
        <p className="mt-4">Đang tải thông tin bộ sưu tập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Đã xảy ra lỗi</h2>
        <p className="mb-6">{error}</p>
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
        {/* Preview column */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Xem trước</h2>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              {/* Đây sẽ là hình ảnh preview */}
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/300?text=LEGO+Preview"
                  alt="Preview"
                  className="mx-auto"
                />
                <p className="mt-4 text-sm text-gray-500">
                  Hình ảnh minh họa sẽ cập nhật theo tùy chọn của bạn
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Áo:</strong>{" "}
                {customization.productSelections.clothing.topColor ||
                  "Chưa chọn"}
              </p>
              <p>
                <strong>Quần:</strong>{" "}
                {customization.productSelections.clothing.bottomColor ||
                  "Chưa chọn"}
              </p>
              <p>
                <strong>Outfit:</strong>{" "}
                {customization.productSelections.clothing.outfit || "Chưa chọn"}
              </p>
              <p>
                <strong>Mặt:</strong>{" "}
                {customization.productSelections.face || "Chưa chọn"}
              </p>
              <p>
                <strong>Tóc:</strong>{" "}
                {customization.productSelections.hair || "Chưa chọn"}
              </p>
              <p>
                <strong>Phụ kiện:</strong>{" "}
                {customization.productSelections.accessories.length > 0
                  ? customization.productSelections.accessories.join(", ")
                  : "Chưa chọn"}
              </p>
              <p>
                <strong>Thú cưng:</strong>{" "}
                {customization.productSelections.pet || "Không có"}
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

        {/* Customization column */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Tùy chỉnh quần áo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <ColorPicker
                  colors={mockColorOptions}
                  selectedColor={
                    customization.productSelections.clothing.topColor
                  }
                  onSelectColor={handleTopColorChange}
                  label="Màu áo"
                />
              </div>
              <div>
                <ColorPicker
                  colors={mockColorOptions}
                  selectedColor={
                    customization.productSelections.clothing.bottomColor
                  }
                  onSelectColor={handleBottomColorChange}
                  label="Màu quần"
                />
              </div>
            </div>

            <OutfitPicker
              outfits={mockOutfits}
              selectedOutfit={customization.productSelections.clothing.outfit}
              onSelectOutfit={handleOutfitSelect}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <ItemSelector
              items={mockHairs}
              selectedItemId={customization.productSelections.hair}
              onSelectItem={handleHairSelect}
              title="Chọn kiểu tóc"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <ItemSelector
              items={mockFaces}
              selectedItemId={customization.productSelections.face}
              onSelectItem={handleFaceSelect}
              title="Chọn kiểu mặt"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <ItemSelector
              items={mockAccessories}
              selectedItemId={customization.productSelections.accessories}
              onSelectItem={handleAccessorySelect}
              title="Chọn phụ kiện"
              multiple={true}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <ItemSelector
              items={mockPets}
              selectedItemId={customization.productSelections.pet}
              onSelectItem={handlePetSelect}
              title="Bạn có thú cưng không?"
            />
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => navigate("/collections")}>
              Quay lại
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
