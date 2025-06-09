// src/redux/features/customizationSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Giá cố định của các phiên bản
const VERSION_PRICES = {
  version1: 245000,
  version2: 250000,
};

const initialState = {
  // Thông tin bộ sưu tập hiện tại
  collection: {
    id: null,
    name: "",
  },

  // Bước hiện tại trong quy trình tùy chỉnh
  step: "products", // products, background, user-info

  // Phiên bản sản phẩm
  version: {
    selected: null, // 'version1' hoặc 'version2'
    isFromCombo: false, // Flag đánh dấu version được cài từ combo
  },

  // Combo trọn bộ (bao gồm cả frame + phụ kiện)
  fullCombo: null,

  // Combo phụ kiện (chỉ bao gồm phụ kiện, không có frame)
  accessoryCombo: null,

  // Tùy chỉnh nhân vật
  characters: {
    character1: {
      topColor: null,
      bottomColor: null,
      hair: null,
      face: null,
    },
    character2: {
      topColor: null,
      bottomColor: null,
      hair: null,
      face: null,
    },
  },

  // Outfit mẫu được chọn (chỉ để tham khảo)
  outfit: null,

  // Phụ kiện mà khách hàng chọn thêm (không bao gồm trong combo)
  additionalAccessories: [],

  // Thú cưng mà khách hàng chọn thêm (nếu không có trong combo)
  additionalPet: null,

  // Thông tin background
  background: {
    template: null,
    title: "",
    date: "",
    name: "",
    song: "",
    customText: "",
    canvaLink: "",
  },

  // Tổng giá của đơn hàng
  totalPrice: 0,
};

const customizationSlice = createSlice({
  name: "customization",
  initialState,
  reducers: {
    // COLLECTION ACTIONS
    setCollection: (state, action) => {
      state.collection = action.payload;
    },

    // NAVIGATION ACTIONS
    setCurrentStep: (state, action) => {
      state.step = action.payload;
    },

    // VERSION ACTIONS
    setVersion: (state, action) => {
      // Nếu đang chọn combo trọn bộ, hủy combo đó trước
      if (state.fullCombo) {
        state.fullCombo = null;
      }

      state.version.selected = action.payload;
      state.version.isFromCombo = false;
    },

    // CHARACTER COLOR ACTIONS
    setCharacter1TopColor: (state, action) => {
      state.characters.character1.topColor = action.payload;
    },

    setCharacter1BottomColor: (state, action) => {
      state.characters.character1.bottomColor = action.payload;
    },

    setCharacter2TopColor: (state, action) => {
      state.characters.character2.topColor = action.payload;
    },

    setCharacter2BottomColor: (state, action) => {
      state.characters.character2.bottomColor = action.payload;
    },

    // CHARACTER FACE ACTIONS
    setCharacter1Face: (state, action) => {
      state.characters.character1.face = action.payload;
    },

    setCharacter2Face: (state, action) => {
      state.characters.character2.face = action.payload;
    },

    // CHARACTER HAIR ACTIONS
    setCharacter1Hair: (state, action) => {
      state.characters.character1.hair = action.payload;
    },

    setCharacter2Hair: (state, action) => {
      state.characters.character2.hair = action.payload;
    },

    // OUTFIT ACTIONS (tham khảo)
    setOutfit: (state, action) => {
      state.outfit = action.payload;
    },

    // ADDITIONAL ACCESSORIES ACTIONS
    addAdditionalAccessory: (state, action) => {
      // Kiểm tra xem phụ kiện có trong danh sách thêm chưa
      const existingIndex = state.additionalAccessories.findIndex(
        (acc) => acc.id === action.payload.id
      );

      if (existingIndex === -1) {
        // Nếu chưa có, thêm vào
        state.additionalAccessories.push(action.payload);
      }

      // Lưu ý: Không cần kiểm tra thêm phụ kiện có trong combo không
      // vì điều này đã được xử lý ở component rồi
    },

    removeAdditionalAccessory: (state, action) => {
      // Xóa phụ kiện khỏi danh sách thêm
      state.additionalAccessories = state.additionalAccessories.filter(
        (acc) => acc.id !== action.payload
      );
    },

    // ADDITIONAL PET ACTIONS
    setAdditionalPet: (state, action) => {
      // Thú cưng được chọn thêm (null nếu không chọn thú cưng thêm)
      state.additionalPet = action.payload;
    },

    // ACCESSORY COMBO ACTIONS
    setAccessoryCombo: (state, action) => {
      // Set combo phụ kiện mới
      state.accessoryCombo = action.payload;

      // Nếu có combo phụ kiện mới
      if (action.payload && action.payload.includes) {
        // Loại bỏ các phụ kiện đã thêm mà trùng với phụ kiện trong combo
        if (action.payload.includes.accessories) {
          state.additionalAccessories = state.additionalAccessories.filter(
            (acc) => !action.payload.includes.accessories.includes(acc.id)
          );
        }

        // Nếu thú cưng đã thêm trùng với thú cưng trong combo, reset thú cưng thêm
        if (
          action.payload.includes.pet &&
          state.additionalPet &&
          state.additionalPet.id === action.payload.includes.pet
        ) {
          state.additionalPet = null;
        }
      }
    },

    removeAccessoryCombo: (state) => {
      // Xóa combo phụ kiện
      state.accessoryCombo = null;
    },

    // FULL COMBO ACTIONS
    setFullCombo: (state, action) => {
      // Set combo trọn bộ mới
      state.fullCombo = action.payload;

      // Set version từ combo
      if (
        action.payload &&
        action.payload.includes &&
        action.payload.includes.version
      ) {
        state.version.selected = action.payload.includes.version;
        state.version.isFromCombo = true;
      }

      // Loại bỏ các phụ kiện đã thêm mà trùng với phụ kiện trong combo
      if (
        action.payload &&
        action.payload.includes &&
        action.payload.includes.accessories
      ) {
        state.additionalAccessories = state.additionalAccessories.filter(
          (acc) => !action.payload.includes.accessories.includes(acc.id)
        );
      }

      // Nếu thú cưng đã thêm trùng với thú cưng trong combo, reset thú cưng thêm
      if (
        action.payload &&
        action.payload.includes &&
        action.payload.includes.pet &&
        state.additionalPet &&
        state.additionalPet.id === action.payload.includes.pet
      ) {
        state.additionalPet = null;
      }
    },

    removeFullCombo: (state) => {
      // Xóa combo trọn bộ và reset flag version
      state.fullCombo = null;
      state.version.isFromCombo = false;
    },

    // PRICE CALCULATION
    recalculatePrice: (state) => {
      let total = 0;

      // 1. Giá cơ bản (combo trọn bộ HOẶC version)
      if (state.fullCombo) {
        // Nếu có combo trọn bộ, lấy giá từ combo
        total += state.fullCombo.price;
      } else if (state.version.selected) {
        // Nếu không có combo trọn bộ nhưng có version, lấy giá từ version
        total += VERSION_PRICES[state.version.selected] || 0;
      }

      // 2. Giá combo phụ kiện (nếu có)
      if (state.accessoryCombo) {
        total += state.accessoryCombo.price || 0;
      }

      // 3. Giá phụ kiện thêm
      if (
        state.additionalAccessories &&
        state.additionalAccessories.length > 0
      ) {
        state.additionalAccessories.forEach((acc) => {
          total += acc.price || 0;
        });
      }

      // 4. Giá thú cưng thêm
      if (state.additionalPet) {
        total += state.additionalPet.price || 0;
      }

      // 5. Giá tóc (chỉ tính nếu không có trong combo trọn bộ)
      // - Tóc nhân vật 1
      if (
        state.characters.character1.hair &&
        (!state.fullCombo || !state.fullCombo.includes?.hair)
      ) {
        total += state.characters.character1.hair.price || 0;
      }

      // - Tóc nhân vật 2
      if (
        state.characters.character2.hair &&
        (!state.fullCombo || !state.fullCombo.includes?.hair)
      ) {
        total += state.characters.character2.hair.price || 0;
      }

      // Cập nhật tổng giá
      state.totalPrice = total;
    },

    // BACKGROUND ACTIONS
    setBackgroundTemplate: (state, action) => {
      state.background.template = action.payload;
    },

    setBackgroundTitle: (state, action) => {
      state.background.title = action.payload;
    },

    setBackgroundDate: (state, action) => {
      state.background.date = action.payload;
    },

    setBackgroundName: (state, action) => {
      state.background.name = action.payload;
    },

    setBackgroundSong: (state, action) => {
      state.background.song = action.payload;
    },

    setBackgroundCustomText: (state, action) => {
      state.background.customText = action.payload;
    },

    setBackgroundCanvaLink: (state, action) => {
      state.background.canvaLink = action.payload;
    },

    // OTHER ACTIONS
    resetCustomization: () => initialState,

    // Cập nhật toàn bộ đối tượng background
    setBackground: (state, action) => {
      state.background = { ...state.background, ...action.payload };
    },

    // Thêm nhiều phụ kiện cùng lúc
    addMultipleAccessories: (state, action) => {
      // Lọc ra những phụ kiện chưa có trong danh sách thêm
      const newAccessories = action.payload.filter(
        (newAcc) =>
          !state.additionalAccessories.some((acc) => acc.id === newAcc.id)
      );

      // Thêm vào danh sách
      state.additionalAccessories = [
        ...state.additionalAccessories,
        ...newAccessories,
      ];
    },

    // Cập nhật thông tin combo tổng thể (hỗ trợ phân tích data)
    updateComboInfo: (state, action) => {
      // Chỉ cập nhật thông tin, không ảnh hưởng đến lựa chọn
      if (state.fullCombo && action.payload.fullComboData) {
        const comboId = state.fullCombo.id;
        const updatedCombo = action.payload.fullComboData.find(
          (c) => c.id === comboId
        );
        if (updatedCombo) {
          state.fullCombo = updatedCombo;
        }
      }

      if (state.accessoryCombo && action.payload.accessoryComboData) {
        const comboId = state.accessoryCombo.id;
        const updatedCombo = action.payload.accessoryComboData.find(
          (c) => c.id === comboId
        );
        if (updatedCombo) {
          state.accessoryCombo = updatedCombo;
        }
      }
    },
  },
});

// Export các actions
export const {
  setCollection,
  setCurrentStep,
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
  recalculatePrice,
  setBackgroundTemplate,
  setBackgroundTitle,
  setBackgroundDate,
  setBackgroundName,
  setBackgroundSong,
  setBackgroundCustomText,
  setBackgroundCanvaLink,
  resetCustomization,
  setBackground,
  addMultipleAccessories,
  updateComboInfo,
} = customizationSlice.actions;

// Export reducer
export default customizationSlice.reducer;
