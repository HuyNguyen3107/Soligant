// src/services/mockCanvaService.js

/**
 * Giả lập việc tạo một Canva design và trả về một URL
 * @param {Object} designData Dữ liệu thiết kế
 */
export const createMockCanvaDesign = async (designData) => {
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Tạo một URL giả cho Canva
  const mockDesignId = Math.random().toString(36).substring(2, 15);
  const mockCanvaUrl = `https://www.canva.com/design/${mockDesignId}/edit`;

  console.log("Mock Canva Design created with data:", designData);

  // Trả về dữ liệu giả lập
  return {
    success: true,
    canvaUrl: mockCanvaUrl,
    designId: mockDesignId,
    message: "Design created successfully",
  };
};

/**
 * Giả lập việc lấy preview của một design
 * @param {String} designId ID của design
 */
export const getMockDesignPreview = async (designId) => {
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Tạo một URL giả cho preview
  const mockPreviewUrl = `https://via.placeholder.com/800x600?text=Preview+${designId}`;

  // Trả về dữ liệu giả lập
  return {
    success: true,
    previewUrl: mockPreviewUrl,
  };
};
