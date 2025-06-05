// src/pages/BackgroundCustomizePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Components
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import FormInput from "../components/ui/FormInput";
import BackgroundTemplateSelector from "../components/ui/BackgroundTemplateSelector";
import CanvaLinkModal from "../components/ui/CanvaLinkModal";

// Data
import { backgroundTemplates } from "../data/productData";

// Services
import { createCanvaDesign } from "../services/canvaService";

// Redux actions
import {
  setBackgroundTemplate,
  setBackgroundTitle,
  setBackgroundDate,
  setBackgroundNames,
  setBackgroundSong,
  setCanvaUrl,
  setCurrentStep,
} from "../redux/features/customizationSlice";

const BackgroundCustomizePage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state
  const [loading, setLoading] = useState(true);
  const [collection, setCollectionData] = useState(null);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCreatingDesign, setIsCreatingDesign] = useState(false);
  const [showCanvaModal, setShowCanvaModal] = useState(false);

  // Redux state
  const customization = useSelector((state) => state.customization);
  const bg = customization.background;

  // Kiểm tra xem người dùng đã hoàn thành bước trước chưa
  useEffect(() => {
    if (!customization.version.selected) {
      toast.error("Vui lòng hoàn thành việc tùy chỉnh sản phẩm trước");
      navigate(`/collections/${collectionId}/customize`);
    }
  }, [customization.version.selected, collectionId, navigate]);

  // Lấy thông tin collection
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
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching collection:", err);
        setError("Không thể tải thông tin bộ sưu tập");
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionId]);

  // Danh sách các danh mục background
  const backgroundCategories = [
    { id: "all", name: "Tất cả" },
    { id: "valentine", name: "Valentine" },
    { id: "anniversary", name: "Kỷ niệm" },
    { id: "birthday", name: "Sinh nhật" },
    { id: "graduation", name: "Tốt nghiệp" },
    { id: "music", name: "Âm nhạc" },
  ];

  // Handlers
  const handleSelectTemplate = (templateId) => {
    const template = backgroundTemplates.find((t) => t.id === templateId);
    if (template) {
      dispatch(setBackgroundTemplate(template));

      // Reset canvaUrl when changing template
      if (bg.canvaUrl) {
        dispatch(setCanvaUrl(""));
      }
    }
  };

  const handleTitleChange = (e) => {
    dispatch(setBackgroundTitle(e.target.value));

    // Reset canvaUrl when changing content
    if (bg.canvaUrl) {
      dispatch(setCanvaUrl(""));
    }
  };

  const handleDateChange = (e) => {
    dispatch(setBackgroundDate(e.target.value));

    // Reset canvaUrl when changing content
    if (bg.canvaUrl) {
      dispatch(setCanvaUrl(""));
    }
  };

  const handleNamesChange = (e) => {
    dispatch(setBackgroundNames(e.target.value));

    // Reset canvaUrl when changing content
    if (bg.canvaUrl) {
      dispatch(setCanvaUrl(""));
    }
  };

  const handleSongChange = (e) => {
    dispatch(setBackgroundSong(e.target.value));

    // Reset canvaUrl when changing content
    if (bg.canvaUrl) {
      dispatch(setCanvaUrl(""));
    }
  };

  const handleCreateCanvaDesign = async () => {
    // Validation
    if (!bg.template) {
      toast.warning("Vui lòng chọn mẫu background");
      return;
    }

    if (bg.template.hasTitle && !bg.title.trim()) {
      toast.warning("Vui lòng nhập tiêu đề");
      return;
    }

    if (bg.template.hasNames && !bg.names.trim()) {
      toast.warning("Vui lòng nhập tên người nhận");
      return;
    }

    try {
      setIsCreatingDesign(true);

      // Prepare data for Canva API
      const designData = {
        templateId: bg.template.id, // ID của template trên Canva
        title: bg.title || " ", // Default to space if empty
        date: bg.date || " ",
        names: bg.names || " ",
        song: bg.song || " ",
        collectionId: collectionId,
        version: customization.version.selected,
      };

      // Call API to create design on Canva
      const response = await createCanvaDesign(designData);

      // Update Redux with Canva URL
      dispatch(setCanvaUrl(response.canvaUrl));

      // Show modal with Canva link
      setShowCanvaModal(true);

      toast.success("Thiết kế background đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating Canva design:", error);
      toast.error("Có lỗi xảy ra khi tạo thiết kế. Vui lòng thử lại sau.");
    } finally {
      setIsCreatingDesign(false);
    }
  };

  const handleProceedToCheckout = () => {
    // Validation
    if (!bg.template) {
      toast.warning("Vui lòng chọn mẫu background");
      return;
    }

    if (bg.template.hasTitle && !bg.title.trim()) {
      toast.warning("Vui lòng nhập tiêu đề");
      return;
    }

    if (bg.template.hasNames && !bg.names.trim()) {
      toast.warning("Vui lòng nhập tên người nhận");
      return;
    }

    // Nếu chưa tạo design trên Canva, tạo trước
    if (!bg.isCanvaDesignCreated) {
      toast.warning("Vui lòng tạo thiết kế background trước khi tiếp tục");
      return;
    }

    // Tiếp tục đến trang thanh toán
    navigate(`/checkout`);
  };

  const handleBackToCustomize = () => {
    dispatch(setCurrentStep("product"));
    navigate(`/collections/${collectionId}/customize`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <Loading size="large" />
        <p className="mt-4 font-utm-avo">Đang tải thông tin...</p>
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

  // Tìm template được chọn
  const selectedTemplateData = bg.template;

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.h1
        className="text-3xl md:text-4xl font-rafgins text-soligant-primary text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tùy chỉnh Background - {collection.display_name}
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview và thông tin đơn hàng */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 font-utm-avo">
              Xem trước Background
            </h2>

            {bg.template ? (
              <div className="mb-6">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={bg.template.imageUrl}
                    alt={bg.template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg font-utm-avo">
                  {bg.template.name}
                </h3>

                {/* Hiển thị thông tin nhập */}
                <div className="mt-4 text-sm">
                  {bg.template.hasTitle && bg.title && (
                    <p className="mb-1 font-utm-avo">
                      <span className="font-bold">Tiêu đề:</span> {bg.title}
                    </p>
                  )}

                  {bg.template.hasDate && bg.date && (
                    <p className="mb-1 font-utm-avo">
                      <span className="font-bold">Ngày:</span> {bg.date}
                    </p>
                  )}

                  {bg.template.hasNames && bg.names && (
                    <p className="mb-1 font-utm-avo">
                      <span className="font-bold">Tên:</span> {bg.names}
                    </p>
                  )}

                  {bg.template.hasSong && bg.song && (
                    <p className="mb-1 font-utm-avo">
                      <span className="font-bold">Bài hát:</span> {bg.song}
                    </p>
                  )}
                </div>

                {/* Nút tạo thiết kế Canva */}
                <div className="mt-4">
                  {bg.isCanvaDesignCreated ? (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setShowCanvaModal(true)}
                    >
                      Xem thiết kế trên Canva
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={handleCreateCanvaDesign}
                      disabled={isCreatingDesign}
                    >
                      {isCreatingDesign ? (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">Đang tạo thiết kế</span>
                          <Loading size="small" color="white" />
                        </span>
                      ) : (
                        "Tạo thiết kế trên Canva"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-100 rounded-lg mb-6">
                <p className="text-gray-500 font-utm-avo">
                  Vui lòng chọn mẫu background
                </p>
              </div>
            )}

            {/* Sản phẩm đã chọn */}
            <div className="mb-4">
              <h3 className="font-bold text-soligant-primary mb-2 font-utm-avo">
                Sản phẩm đã chọn:
              </h3>
              <p className="font-utm-avo mb-1">
                {customization.version.selected === "version1"
                  ? "Version 1 - Khung tranh có 01 LEGO"
                  : "Version 2 - Khung tranh có 02 LEGO"}
              </p>
            </div>

            {/* Tổng tiền */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-utm-avo">Tổng tiền:</span>
                <span className="text-xl font-bold text-soligant-primary font-utm-avo">
                  {new Intl.NumberFormat("vi-VN").format(
                    customization.totalPrice
                  )}{" "}
                  VNĐ
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full mt-6"
              onClick={handleProceedToCheckout}
              disabled={!bg.isCanvaDesignCreated}
            >
              Tiến hành đặt hàng
            </Button>
            {!bg.isCanvaDesignCreated && (
              <p className="text-xs text-center mt-2 text-red-500 font-utm-avo">
                * Vui lòng tạo thiết kế trước khi đặt hàng
              </p>
            )}
          </div>
        </div>

        {/* Phần tùy chỉnh background */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          {/* Chọn mẫu background */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 font-utm-avo">
              Chọn mẫu Background
            </h2>

            {/* Filter by category */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                {backgroundCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full font-utm-avo ${
                      activeCategory === category.id
                        ? "bg-soligant-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background templates */}
            <BackgroundTemplateSelector
              templates={backgroundTemplates}
              selectedTemplate={bg.template?.id}
              onSelectTemplate={handleSelectTemplate}
              type={activeCategory}
            />
          </div>

          {/* Tùy chỉnh nội dung */}
          {selectedTemplateData && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 font-utm-avo">
                Tùy chỉnh nội dung
              </h2>

              {selectedTemplateData.hasTitle && (
                <FormInput
                  label="Tiêu đề"
                  id="background-title"
                  value={bg.title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề cho background"
                  maxLength={50}
                  required
                />
              )}

              {selectedTemplateData.hasDate && (
                <FormInput
                  label="Ngày tháng"
                  id="background-date"
                  value={bg.date}
                  onChange={handleDateChange}
                  placeholder="VD: 14/02/2025 hoặc 14-02-2025"
                  maxLength={20}
                />
              )}

              {selectedTemplateData.hasNames && (
                <FormInput
                  label="Tên người nhận"
                  id="background-names"
                  value={bg.names}
                  onChange={handleNamesChange}
                  placeholder="VD: Anh Đế & Em Hằng"
                  maxLength={50}
                  required
                />
              )}

              {selectedTemplateData.hasSong && (
                <FormInput
                  label="Bài hát"
                  id="background-song"
                  value={bg.song}
                  onChange={handleSongChange}
                  placeholder="VD: Từng Là - Chillies"
                  maxLength={100}
                />
              )}

              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={handleCreateCanvaDesign}
                  disabled={isCreatingDesign}
                  className="w-full"
                >
                  {isCreatingDesign ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Đang tạo thiết kế</span>
                      <Loading size="small" color="white" />
                    </span>
                  ) : bg.isCanvaDesignCreated ? (
                    "Cập nhật thiết kế"
                  ) : (
                    "Tạo thiết kế trên Canva"
                  )}
                </Button>

                {bg.isCanvaDesignCreated && (
                  <p className="text-center text-green-600 mt-2 font-utm-avo">
                    ✓ Đã tạo thiết kế
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBackToCustomize}>
              Quay lại tùy chỉnh sản phẩm
            </Button>
            <Button
              variant="primary"
              onClick={handleProceedToCheckout}
              disabled={!bg.isCanvaDesignCreated}
            >
              Tiến hành đặt hàng
            </Button>
          </div>
        </div>
      </div>

      {/* Canva Link Modal */}
      <CanvaLinkModal
        isOpen={showCanvaModal}
        onClose={() => setShowCanvaModal(false)}
        canvaUrl={bg.canvaUrl}
      />
    </div>
  );
};

export default BackgroundCustomizePage;
