// src/redux/features/customizationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collectionId: null,
  collectionName: "",
  version: {
    selected: null, // 'version1' or 'version2'
    version1: {
      id: "version1",
      name: "Version 1",
      price: 245000,
      description: "Khung tranh bên trong có 01 LEGO",
    },
    version2: {
      id: "version2",
      name: "Version 2",
      price: 250000,
      description: "Khung tranh bên trong có 02 LEGO",
    },
  },
  characters: {
    character1: {
      // Nhân vật 1 (Bên trái)
      topColor: null,
      bottomColor: null,
      face: null,
      hair: null,
    },
    character2: {
      // Nhân vật 2 (Bên phải) - chỉ có khi chọn version2
      topColor: null,
      bottomColor: null,
      face: null,
      hair: null,
    },
  },
  outfit: null, // 'vintage', 'casual', 'pastel'
  accessories: [], // Mảng chứa ID các phụ kiện được chọn
  pet: null, // ID của thú cưng được chọn
  combo: [], // Mảng chứa ID các combo được chọn
  background: {
    template: null, // Object chứa thông tin template background
    title: "",
    date: "",
    names: "", // Tên người trong background
    song: "",
    canvaUrl: "", // Thêm trường mới để lưu URL đến file Canva
    isCanvaDesignCreated: false, // Trạng thái đã tạo design trên Canva chưa
  },
  totalPrice: 0, // Tổng giá sản phẩm
  currentStep: "product", // 'product', 'background'
};

const customizationSlice = createSlice({
  name: "customization",
  initialState,
  reducers: {
    // Chọn bộ sưu tập
    setCollection: (state, action) => {
      state.collectionId = action.payload.id;
      state.collectionName = action.payload.name;
    },

    // Chọn version
    setVersion: (state, action) => {
      state.version.selected = action.payload;
      // Cập nhật giá ban đầu
      if (action.payload === "version1") {
        state.totalPrice = state.version.version1.price;
      } else if (action.payload === "version2") {
        state.totalPrice = state.version.version2.price;
      }
    },

    // Actions cho nhân vật 1
    setCharacter1TopColor: (state, action) => {
      state.characters.character1.topColor = action.payload;
    },
    setCharacter1BottomColor: (state, action) => {
      state.characters.character1.bottomColor = action.payload;
    },
    setCharacter1Face: (state, action) => {
      state.characters.character1.face = action.payload;
      // Cập nhật giá nếu có thay đổi
      const prevPrice = state.characters.character1.face
        ? 0
        : action.payload.price || 0;
      state.totalPrice =
        state.totalPrice - prevPrice + (action.payload.price || 0);
    },
    setCharacter1Hair: (state, action) => {
      state.characters.character1.hair = action.payload;
      // Cập nhật giá
      const prevPrice = state.characters.character1.hair
        ? state.characters.character1.hair.price || 0
        : 0;
      state.totalPrice =
        state.totalPrice - prevPrice + (action.payload.price || 0);
    },

    // Actions cho nhân vật 2
    setCharacter2TopColor: (state, action) => {
      state.characters.character2.topColor = action.payload;
    },
    setCharacter2BottomColor: (state, action) => {
      state.characters.character2.bottomColor = action.payload;
    },
    setCharacter2Face: (state, action) => {
      state.characters.character2.face = action.payload;
      // Cập nhật giá
      const prevPrice = state.characters.character2.face
        ? state.characters.character2.face.price || 0
        : 0;
      state.totalPrice =
        state.totalPrice - prevPrice + (action.payload.price || 0);
    },
    setCharacter2Hair: (state, action) => {
      state.characters.character2.hair = action.payload;
      // Cập nhật giá
      const prevPrice = state.characters.character2.hair
        ? state.characters.character2.hair.price || 0
        : 0;
      state.totalPrice =
        state.totalPrice - prevPrice + (action.payload.price || 0);
    },

    // Actions cho outfit
    setOutfit: (state, action) => {
      state.outfit = action.payload;
      // Khi chọn outfit, có thể cập nhật màu cho cả 2 nhân vật
      if (action.payload === "vintage") {
        state.characters.character1.topColor = {
          name: "Nâu",
          colorCode: "#8B4513",
        };
        state.characters.character1.bottomColor = {
          name: "Nâu đậm",
          colorCode: "#5D4037",
        };
        if (state.version.selected === "version2") {
          state.characters.character2.topColor = {
            name: "Nâu",
            colorCode: "#8B4513",
          };
          state.characters.character2.bottomColor = {
            name: "Nâu đậm",
            colorCode: "#5D4037",
          };
        }
      } else if (action.payload === "casual") {
        state.characters.character1.topColor = {
          name: "Xanh dương",
          colorCode: "#1976D2",
        };
        state.characters.character1.bottomColor = {
          name: "Đen",
          colorCode: "#212121",
        };
        if (state.version.selected === "version2") {
          state.characters.character2.topColor = {
            name: "Xanh dương",
            colorCode: "#1976D2",
          };
          state.characters.character2.bottomColor = {
            name: "Đen",
            colorCode: "#212121",
          };
        }
      } else if (action.payload === "pastel") {
        state.characters.character1.topColor = {
          name: "Hồng nhạt",
          colorCode: "#FFCDD2",
        };
        state.characters.character1.bottomColor = {
          name: "Xanh mint",
          colorCode: "#B2EBF2",
        };
        if (state.version.selected === "version2") {
          state.characters.character2.topColor = {
            name: "Hồng nhạt",
            colorCode: "#FFCDD2",
          };
          state.characters.character2.bottomColor = {
            name: "Xanh mint",
            colorCode: "#B2EBF2",
          };
        }
      }
    },

    // Actions cho phụ kiện
    addAccessory: (state, action) => {
      // Kiểm tra xem đã có phụ kiện này chưa
      const existingIndex = state.accessories.findIndex(
        (acc) => acc.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.accessories.push(action.payload);
        // Cập nhật giá
        state.totalPrice += action.payload.price || 0;
      }
    },
    removeAccessory: (state, action) => {
      const accessoryToRemove = state.accessories.find(
        (acc) => acc.id === action.payload
      );
      if (accessoryToRemove) {
        state.totalPrice -= accessoryToRemove.price || 0;
      }
      state.accessories = state.accessories.filter(
        (acc) => acc.id !== action.payload
      );
    },

    // Actions cho thú cưng
    setPet: (state, action) => {
      const prevPet = state.pet;
      state.pet = action.payload;

      // Cập nhật giá
      if (prevPet) {
        state.totalPrice -= prevPet.price || 0;
      }
      if (action.payload) {
        state.totalPrice += action.payload.price || 0;
      }
    },

    // Actions cho combo
    addCombo: (state, action) => {
      state.combo.push(action.payload);
      // Cập nhật giá - lưu ý combo đã có giá ưu đãi
      state.totalPrice += action.payload.price || 0;
    },
    removeCombo: (state, action) => {
      const comboToRemove = state.combo.find((c) => c.id === action.payload);
      if (comboToRemove) {
        state.totalPrice -= comboToRemove.price || 0;
      }
      state.combo = state.combo.filter((c) => c.id !== action.payload);
    },

    // Actions cho background
    setBackgroundTemplate: (state, action) => {
      state.background.template = action.payload;
    },
    setBackgroundTitle: (state, action) => {
      state.background.title = action.payload;
    },
    setBackgroundDate: (state, action) => {
      state.background.date = action.payload;
    },
    setBackgroundNames: (state, action) => {
      state.background.names = action.payload;
    },
    setBackgroundSong: (state, action) => {
      state.background.song = action.payload;
    },
    // Thêm action mới cho Canva URL
    setCanvaUrl: (state, action) => {
      state.background.canvaUrl = action.payload;
      state.background.isCanvaDesignCreated = true;
    },

    // Điều hướng giữa các bước
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },

    // Tính tổng giá
    recalculatePrice: (state) => {
      let total = 0;

      // Giá của version
      if (state.version.selected === "version1") {
        total += state.version.version1.price;
      } else if (state.version.selected === "version2") {
        total += state.version.version2.price;
      }

      // Giá của tóc, mặt
      if (state.characters.character1.hair) {
        total += state.characters.character1.hair.price || 0;
      }
      if (state.characters.character1.face) {
        total += state.characters.character1.face.price || 0;
      }

      if (state.version.selected === "version2") {
        if (state.characters.character2.hair) {
          total += state.characters.character2.hair.price || 0;
        }
        if (state.characters.character2.face) {
          total += state.characters.character2.face.price || 0;
        }
      }

      // Giá của phụ kiện
      state.accessories.forEach((acc) => {
        total += acc.price || 0;
      });

      // Giá của thú cưng
      if (state.pet) {
        total += state.pet.price || 0;
      }

      // Giá của combo (đã được tính ưu đãi)
      state.combo.forEach((c) => {
        total += c.price || 0;
      });

      state.totalPrice = total;
    },

    // Reset state
    resetCustomization: () => initialState,
  },
});

export const {
  setCollection,
  setVersion,
  setCharacter1TopColor,
  setCharacter1BottomColor,
  setCharacter1Face,
  setCharacter1Hair,
  setCharacter2TopColor,
  setCharacter2BottomColor,
  setCharacter2Face,
  setCharacter2Hair,
  setOutfit,
  addAccessory,
  removeAccessory,
  setPet,
  addCombo,
  removeCombo,
  setBackgroundTemplate,
  setBackgroundTitle,
  setBackgroundDate,
  setBackgroundNames,
  setBackgroundSong,
  setCanvaUrl,
  setCurrentStep,
  recalculatePrice,
  resetCustomization,
} = customizationSlice.actions;

export default customizationSlice.reducer;
