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

// Data
import { backgroundTemplates } from "../data/productData";

// Redux actions
import {
  setBackgroundTemplate,
  setBackgroundTitle,
  setBackgroundDate,
  setBackgroundName,
  setBackgroundSong,
  setBackground,
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
    }
  };

  const handleTitleChange = (e) => {
    dispatch(setBackgroundTitle(e.target.value));
  };

  const handleDateChange = (e) => {
    dispatch(setBackgroundDate(e.target.value));
  };

  const handleNamesChange = (e) => {
    // Sửa từ setBackgroundNames thành setBackgroundName
    dispatch(setBackgroundName(e.target.value));
  };

  const handleSongChange = (e) => {
    dispatch(setBackgroundSong(e.target.value));
  };

  const handleCompleteCustomization = () => {
    // Validation
    if (!bg.template) {
      toast.warning("Vui lòng chọn mẫu background");
      return;
    }

    if (bg.template.hasTitle && !bg.title.trim()) {
      toast.warning("Vui lòng nhập tiêu đề");
      return;
    }

    if (bg.template.hasNames && !bg.name.trim()) {
      toast.warning("Vui lòng nhập tên người nhận");
      return;
    }

    // Đánh dấu hoàn thành tùy chỉnh background
    // Thay đổi từ setBackgroundCustomizationComplete sang setBackground
    dispatch(
      setBackground({
        customizationComplete: true,
      })
    );

    toast.success(
      "Đã hoàn thành tùy chỉnh background! Bạn có thể tiếp tục đặt hàng."
    );
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

    if (bg.template.hasNames && !bg.name.trim()) {
      toast.warning("Vui lòng nhập tên người nhận");
      return;
    }

    // Nếu chưa hoàn thành tùy chỉnh background, tự động hoàn thành
    if (!bg.customizationComplete) {
      // Thay đổi từ setBackgroundCustomizationComplete sang setBackground
      dispatch(
        setBackground({
          customizationComplete: true,
        })
      );
    }

    // Tiếp tục đến trang đặt hàng
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

  // Format giá combo
  const getComboName = () => {
    if (customization.fullCombo) {
      return customization.fullCombo.name;
    }
    return "";
  };

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
                <p className="text-sm text-gray-600 font-utm-avo mb-4">
                  {bg.template.description}
                </p>

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

                  {bg.template.hasNames && bg.name && (
                    <p className="mb-1 font-utm-avo">
                      <span className="font-bold">Tên:</span> {bg.name}
                    </p>
                  )}

                  {bg.template.hasSong && bg.song && (
                    <p className="mb-1 font-utm-avo">
                      <span className="font-bold">Bài hát:</span> {bg.song}
                    </p>
                  )}
                </div>

                {/* Thông báo cho admin */}
                {bg.customizationComplete && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-utm-avo">
                      ✅ <strong>Đã hoàn thành tùy chỉnh!</strong>
                      <br />
                      Nhân viên sẽ tạo design dựa trên thông tin này.
                    </p>
                  </div>
                )}
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
              {customization.fullCombo ? (
                <p className="font-utm-avo mb-1">
                  {getComboName()} (Combo trọn bộ)
                </p>
              ) : (
                <p className="font-utm-avo mb-1">
                  {customization.version.selected === "version1"
                    ? "Version 1 - Khung tranh có 01 LEGO"
                    : "Version 2 - Khung tranh có 02 LEGO"}
                </p>
              )}

              {customization.accessoryCombo && (
                <p className="font-utm-avo mb-1">
                  {customization.accessoryCombo.name} (Combo phụ kiện)
                </p>
              )}
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
            >
              Tiến hành đặt hàng
            </Button>
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
                    className={`px-4 py-2 rounded-full font-utm-avo transition-colors ${
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

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-utm-avo">
                  <strong>💡 Lưu ý:</strong> Thông tin bạn nhập sẽ được nhân
                  viên sử dụng để tạo background tùy chỉnh. Bạn sẽ nhận được ảnh
                  demo trước khi quyết định chốt đơn.
                </p>
              </div>

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
                  value={bg.name}
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
                {!bg.customizationComplete ? (
                  <Button
                    variant="primary"
                    onClick={handleCompleteCustomization}
                    className="w-full"
                  >
                    Hoàn thành tùy chỉnh Background
                  </Button>
                ) : (
                  <div className="text-center">
                    <p className="text-green-600 mb-3 font-utm-avo">
                      ✅ Đã hoàn thành tùy chỉnh background
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        // Thay đổi từ setBackgroundCustomizationComplete sang setBackground
                        dispatch(
                          setBackground({
                            customizationComplete: false,
                          })
                        )
                      }
                      className="w-full"
                    >
                      Chỉnh sửa lại
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hướng dẫn quy trình */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 font-utm-avo">
              🔄 Quy trình tiếp theo
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-soligant-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="font-utm-avo text-sm">
                  Bạn hoàn thành đặt hàng với thông tin tùy chỉnh
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-soligant-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="font-utm-avo text-sm">
                  Nhân viên tạo background design dựa trên thông tin của bạn
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-soligant-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="font-utm-avo text-sm">
                  Bạn nhận ảnh demo và quyết định chốt đơn hoặc yêu cầu điều
                  chỉnh
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-soligant-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <p className="font-utm-avo text-sm">
                  Sau khi chốt đơn, chúng tôi sẽ sản xuất và giao hàng
                </p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBackToCustomize}>
              Quay lại tùy chỉnh sản phẩm
            </Button>
            <Button variant="primary" onClick={handleProceedToCheckout}>
              Tiến hành đặt hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundCustomizePage;
