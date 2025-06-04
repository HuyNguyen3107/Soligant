import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collectionId: null,
  collectionName: "",
  productSelections: {
    clothing: {
      topColor: null,
      bottomColor: null,
      outfit: null, // 'vintage', 'casual', 'pastel'
    },
    face: null,
    hair: null,
    accessories: [],
    pet: null,
    background: {
      template: null,
      title: "",
      date: "",
      name: "",
      song: "",
    },
  },
  currentStep: "clothing", // 'clothing', 'face', 'hair', 'accessories', 'background'
};

const customizationSlice = createSlice({
  name: "customization",
  initialState,
  reducers: {
    setCollection: (state, action) => {
      state.collectionId = action.payload.id;
      state.collectionName = action.payload.name;
    },

    // Các actions cho quần áo
    setTopColor: (state, action) => {
      state.productSelections.clothing.topColor = action.payload;
    },
    setBottomColor: (state, action) => {
      state.productSelections.clothing.bottomColor = action.payload;
    },
    setOutfit: (state, action) => {
      state.productSelections.clothing.outfit = action.payload;

      // Khi chọn outfit, có thể cập nhật cả màu top và bottom
      if (action.payload === "vintage") {
        state.productSelections.clothing.topColor = "#8B4513"; // Nâu
        state.productSelections.clothing.bottomColor = "#5D4037"; // Nâu đậm
      } else if (action.payload === "casual") {
        state.productSelections.clothing.topColor = "#1976D2"; // Xanh dương
        state.productSelections.clothing.bottomColor = "#212121"; // Đen
      } else if (action.payload === "pastel") {
        state.productSelections.clothing.topColor = "#FFCDD2"; // Hồng nhạt
        state.productSelections.clothing.bottomColor = "#B2EBF2"; // Xanh mint
      }
    },

    // Các actions cho mặt, tóc, phụ kiện
    setFace: (state, action) => {
      state.productSelections.face = action.payload;
    },
    setHair: (state, action) => {
      state.productSelections.hair = action.payload;
    },
    addAccessory: (state, action) => {
      state.productSelections.accessories.push(action.payload);
    },
    removeAccessory: (state, action) => {
      state.productSelections.accessories =
        state.productSelections.accessories.filter(
          (accessory) => accessory.id !== action.payload
        );
    },
    setPet: (state, action) => {
      state.productSelections.pet = action.payload;
    },

    // Actions cho background
    setBackgroundTemplate: (state, action) => {
      state.productSelections.background.template = action.payload;
    },
    setBackgroundTitle: (state, action) => {
      state.productSelections.background.title = action.payload;
    },
    setBackgroundDate: (state, action) => {
      state.productSelections.background.date = action.payload;
    },
    setBackgroundName: (state, action) => {
      state.productSelections.background.name = action.payload;
    },
    setBackgroundSong: (state, action) => {
      state.productSelections.background.song = action.payload;
    },

    // Điều hướng giữa các bước
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },

    // Reset state
    resetCustomization: () => initialState,
  },
});

export const {
  setCollection,
  setTopColor,
  setBottomColor,
  setOutfit,
  setFace,
  setHair,
  addAccessory,
  removeAccessory,
  setPet,
  setBackgroundTemplate,
  setBackgroundTitle,
  setBackgroundDate,
  setBackgroundName,
  setBackgroundSong,
  setCurrentStep,
  resetCustomization,
} = customizationSlice.actions;

export default customizationSlice.reducer;
