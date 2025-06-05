// src/data/productData.js

// Màu sắc quần áo
export const clothingColors = [
  { name: "Đen", colorCode: "#000000" },
  { name: "Xám đậm", colorCode: "#555555" },
  { name: "Xám nhạt", colorCode: "#888888" },
  { name: "Xám trắng", colorCode: "#DDDDDD" },
  { name: "Trắng", colorCode: "#FFFFFF" },
  { name: "Nâu", colorCode: "#8B4513" },
  { name: "Xanh rêu", colorCode: "#556B2F" },
  { name: "Be", colorCode: "#F5F5DC" },
  { name: "Hồng", colorCode: "#FFC0CB" },
  { name: "Tím", colorCode: "#9370DB" },
  { name: "Xanh dương", colorCode: "#1E90FF" },
];

// Outfit mẫu
export const outfits = [
  {
    id: "vintage",
    name: "Mẫu Vintage",
    imageUrl: "https://via.placeholder.com/150?text=Vintage",
    description: "Phong cách cổ điển, mang đậm nét hoài niệm",
    topColor: { name: "Nâu", colorCode: "#8B4513" },
    bottomColor: { name: "Nâu đậm", colorCode: "#5D4037" },
  },
  {
    id: "casual",
    name: "Mẫu Cá tính",
    imageUrl: "https://via.placeholder.com/150?text=Casual",
    description: "Phong cách hiện đại, năng động",
    topColor: { name: "Xanh dương", colorCode: "#1976D2" },
    bottomColor: { name: "Đen", colorCode: "#212121" },
  },
  {
    id: "pastel",
    name: "Mẫu Pastel",
    imageUrl: "https://via.placeholder.com/150?text=Pastel",
    description: "Phong cách nhẹ nhàng, màu sắc tươi sáng",
    topColor: { name: "Hồng nhạt", colorCode: "#FFCDD2" },
    bottomColor: { name: "Xanh mint", colorCode: "#B2EBF2" },
  },
];

// Kiểu tóc
export const hairStyles = [
  {
    id: "hair_nu_dai_thang",
    name: "Tóc Nữ - Dài Thẳng",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+N%E1%BB%AF+D%C3%A0i+Th%E1%BA%B3ng",
    gender: "female",
  },
  {
    id: "hair_nu_dai_uon",
    name: "Tóc Nữ - Dài Uốn",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+N%E1%BB%AF+D%C3%A0i+U%E1%BB%91n",
    gender: "female",
  },
  {
    id: "hair_nu_ngan_mai_dai",
    name: "Tóc Nữ - Ngắn Mai Dài",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+N%E1%BB%AF+Ng%E1%BA%AFn+Mai+D%C3%A0i",
    gender: "female",
  },
  {
    id: "hair_nu_ngan_mai",
    name: "Tóc Nữ - Ngắn Mai",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+N%E1%BB%AF+Ng%E1%BA%AFn+Mai",
    gender: "female",
  },
  {
    id: "hair_nu_mai_uon",
    name: "Tóc Nữ - Mai Uốn",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+N%E1%BB%AF+Mai+U%E1%BB%91n",
    gender: "female",
  },
  {
    id: "hair_nu_mai_bang",
    name: "Tóc Nữ - Mai Bằng",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+N%E1%BB%AF+Mai+B%E1%BA%B1ng",
    gender: "female",
  },
  {
    id: "hair_nu_ngan_tung",
    name: "Tóc Nữ - Ngắn Tung",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+N%E1%BB%AF+Ng%E1%BA%AFn+Tung",
    gender: "female",
  },
  {
    id: "hair_nam_ngan_dung",
    name: "Tóc Nam - Ngắn Đứng",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+Nam+Ng%E1%BA%AFn+%C4%90%E1%BB%A9ng",
    gender: "male",
  },
  {
    id: "hair_nam_den",
    name: "Tóc Nam - Đen",
    price: 25000,
    imageUrl: "https://via.placeholder.com/150?text=T%C3%B3c+Nam+%C4%90en",
    gender: "male",
  },
  {
    id: "hair_nam_vuot_ngang",
    name: "Tóc Nam - Vuốt Ngang",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+Nam+Vu%E1%BB%91t+Ngang",
    gender: "male",
  },
  {
    id: "hair_nam_vuot_nguoc",
    name: "Tóc Nam - Vuốt Ngược",
    price: 25000,
    imageUrl:
      "https://via.placeholder.com/150?text=T%C3%B3c+Nam+Vu%E1%BB%91t+Ng%C6%B0%E1%BB%A3c",
    gender: "male",
  },
];

// Kiểu mặt
export const faceStyles = [
  {
    id: "face_nu_1",
    name: "Mặt Nữ 1",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+N%E1%BB%AF+1",
    gender: "female",
  },
  {
    id: "face_nu_2",
    name: "Mặt Nữ 2",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+N%E1%BB%AF+2",
    gender: "female",
  },
  {
    id: "face_nu_3",
    name: "Mặt Nữ 3",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+N%E1%BB%AF+3",
    gender: "female",
  },
  {
    id: "face_nu_4",
    name: "Mặt Nữ 4",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+N%E1%BB%AF+4",
    gender: "female",
  },
  {
    id: "face_nu_5",
    name: "Mặt Nữ 5",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+N%E1%BB%AF+5",
    gender: "female",
  },
  {
    id: "face_nam_1",
    name: "Mặt Nam 1",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+Nam+1",
    gender: "male",
  },
  {
    id: "face_nam_2",
    name: "Mặt Nam 2",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+Nam+2",
    gender: "male",
  },
  {
    id: "face_nam_3",
    name: "Mặt Nam 3",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+Nam+3",
    gender: "male",
  },
  {
    id: "face_nam_4",
    name: "Mặt Nam 4",
    imageUrl: "https://via.placeholder.com/150?text=M%E1%BA%B7t+Nam+4",
    gender: "male",
  },
];

// Phụ kiện cầm tay
export const accessories = [
  {
    id: "acc_bag",
    name: "Túi xách",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=T%C3%BAi+X%C3%A1ch",
    type: "bag",
  },
  {
    id: "acc_camera",
    name: "Máy ảnh",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=M%C3%A1y+%E1%BA%A2nh",
    type: "device",
  },
  {
    id: "acc_phone1",
    name: "Điện thoại 1",
    price: 10000,
    imageUrl:
      "https://via.placeholder.com/150?text=%C4%90i%E1%BB%87n+Tho%E1%BA%A1i+1",
    type: "device",
  },
  {
    id: "acc_phone2",
    name: "Điện thoại 2",
    price: 10000,
    imageUrl:
      "https://via.placeholder.com/150?text=%C4%90i%E1%BB%87n+Tho%E1%BA%A1i+2",
    type: "device",
  },
  {
    id: "acc_teddy",
    name: "Gấu bé",
    price: 15000,
    imageUrl: "https://via.placeholder.com/150?text=G%E1%BA%A5u+B%C3%A9",
    type: "toy",
  },
  {
    id: "acc_pretzel",
    name: "Bánh vòng",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=B%C3%A1nh+V%C3%B2ng",
    type: "food",
  },
  {
    id: "acc_croissant",
    name: "Bánh sừng bò",
    price: 10000,
    imageUrl:
      "https://via.placeholder.com/150?text=B%C3%A1nh+S%E1%BB%ABng+B%C3%B2",
    type: "food",
  },
  {
    id: "acc_icecream_white",
    name: "Kem trắng",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=Kem+Tr%E1%BA%AFng",
    type: "food",
  },
  {
    id: "acc_icecream_pink",
    name: "Kem hồng",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=Kem+H%E1%BB%93ng",
    type: "food",
  },
  {
    id: "acc_comb_purple",
    name: "Lược tím",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=L%C6%B0%E1%BB%A3c+T%C3%ADm",
    type: "accessory",
  },
  {
    id: "acc_lollipop1",
    name: "Kẹo mút 1",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=K%E1%BA%B9o+M%C3%BAt+1",
    type: "food",
  },
  {
    id: "acc_lollipop2",
    name: "Kẹo mút 2",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=K%E1%BA%B9o+M%C3%BAt+2",
    type: "food",
  },
  {
    id: "acc_grad_cap",
    name: "Mũ tốt nghiệp",
    price: 10000,
    imageUrl:
      "https://via.placeholder.com/150?text=M%C5%A9+T%E1%BB%91t+Nghi%E1%BB%87p",
    type: "graduation",
  },
  {
    id: "acc_comb_pink",
    name: "Lược hồng",
    price: 10000,
    imageUrl:
      "https://via.placeholder.com/150?text=L%C6%B0%E1%BB%A3c+H%E1%BB%93ng",
    type: "accessory",
  },
  {
    id: "acc_flower_purple",
    name: "Hoa tím",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=Hoa+T%C3%ADm",
    type: "flower",
  },
  {
    id: "acc_flower_blue",
    name: "Hoa xanh",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=Hoa+Xanh",
    type: "flower",
  },
  {
    id: "acc_flower_white",
    name: "Hoa trắng",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=Hoa+Tr%E1%BA%AFng",
    type: "flower",
  },
  {
    id: "acc_flower_pink",
    name: "Hoa hồng",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=Hoa+H%E1%BB%93ng",
    type: "flower",
  },
];

// Thú cưng
export const pets = [
  {
    id: "pet_cat_gray",
    name: "Mèo xám",
    price: 15000,
    imageUrl: "https://via.placeholder.com/150?text=M%C3%A8o+X%C3%A1m",
    type: "cat",
  },
  {
    id: "pet_cat_black",
    name: "Mèo đen mini",
    price: 15000,
    imageUrl: "https://via.placeholder.com/150?text=M%C3%A8o+%C4%90en+Mini",
    type: "cat",
  },
  {
    id: "pet_cat_yellow",
    name: "Mèo vàng",
    price: 15000,
    imageUrl: "https://via.placeholder.com/150?text=M%C3%A8o+V%C3%A0ng",
    type: "cat",
  },
  {
    id: "pet_cat_brown",
    name: "Mèo nâu/cam",
    price: 15000,
    imageUrl: "https://via.placeholder.com/150?text=M%C3%A8o+N%C3%A2u",
    type: "cat",
  },
  {
    id: "pet_rabbit",
    name: "Thỏ trắng",
    price: 15000,
    imageUrl: "https://via.placeholder.com/150?text=Th%E1%BB%8F+Tr%E1%BA%AFng",
    type: "rabbit",
  },
  {
    id: "pet_dog_white1",
    name: "Chó trắng 1",
    price: 20000,
    imageUrl: "https://via.placeholder.com/150?text=Ch%C3%B3+Tr%E1%BA%AFng+1",
    type: "dog",
  },
  {
    id: "pet_dog_brown1",
    name: "Chó nâu 1",
    price: 20000,
    imageUrl: "https://via.placeholder.com/150?text=Ch%C3%B3+N%C3%A2u+1",
    type: "dog",
  },
  {
    id: "pet_dog_brown2",
    name: "Chó nâu 2",
    price: 20000,
    imageUrl: "https://via.placeholder.com/150?text=Ch%C3%B3+N%C3%A2u+2",
    type: "dog",
  },
  {
    id: "pet_dog_brown3",
    name: "Chó nâu 3",
    price: 20000,
    imageUrl: "https://via.placeholder.com/150?text=Ch%C3%B3+N%C3%A2u+3",
    type: "dog",
  },
  {
    id: "pet_dog_white2",
    name: "Chó trắng 2",
    price: 20000,
    imageUrl: "https://via.placeholder.com/150?text=Ch%C3%B3+Tr%E1%BA%AFng+2",
    type: "dog",
  },
  {
    id: "pet_fish_beige",
    name: "Cá be",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=C%C3%A1+Be",
    type: "fish",
  },
  {
    id: "pet_fish_orange",
    name: "Cá cam",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=C%C3%A1+Cam",
    type: "fish",
  },
  {
    id: "pet_fish_blue",
    name: "Cá xanh",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=C%C3%A1+Xanh",
    type: "fish",
  },
  {
    id: "pet_fish_gray",
    name: "Cá xám",
    price: 10000,
    imageUrl: "https://via.placeholder.com/150?text=C%C3%A1+X%C3%A1m",
    type: "fish",
  },
];

// Combo ưu đãi
export const combos = [
  {
    id: "combo_graduation",
    name: "Combo tốt nghiệp ưu đãi",
    description: "Tóc bất kỳ + Mũ tốt nghiệp + Tặng 01 hoa cầm tay",
    price: 280000,
    originalPrice: 290000,
    imageUrl:
      "https://via.placeholder.com/300?text=Combo+T%E1%BB%91t+Nghi%E1%BB%87p",
    version: "version1",
  },
  {
    id: "combo_dog_flower",
    name: "Combo chó + phụ kiện",
    description: "Chó có khắc gãi + Hoa",
    price: 25000,
    originalPrice: 30000,
    imageUrl: "https://via.placeholder.com/300?text=Combo+Ch%C3%B3+%26+Hoa",
    version: null,
  },
  {
    id: "combo_bag_flower",
    name: "Combo túi + hoa",
    description: "Túi xách be + Hoa",
    price: 15000,
    originalPrice: 20000,
    imageUrl: "https://via.placeholder.com/300?text=Combo+T%C3%BAi+%26+Hoa",
    version: null,
  },
];

// Mẫu background
export const backgroundTemplates = [
  {
    id: "bg_valentine1",
    name: "Happy Valentine's Day",
    type: "valentine",
    imageUrl: "https://via.placeholder.com/300?text=Valentine+1",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
  {
    id: "bg_anniversary",
    name: "Happy 1st Anniversary",
    type: "anniversary",
    imageUrl: "https://via.placeholder.com/300?text=Anniversary",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
  {
    id: "bg_valentine2",
    name: "Happy Valentine's Day (Blue)",
    type: "valentine",
    imageUrl: "https://via.placeholder.com/300?text=Valentine+2",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
  {
    id: "bg_birthday1",
    name: "Happy Birthday To You",
    type: "birthday",
    imageUrl: "https://via.placeholder.com/300?text=Birthday+1",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
  {
    id: "bg_birthday2",
    name: "Happy Birthday To You (Purple)",
    type: "birthday",
    imageUrl: "https://via.placeholder.com/300?text=Birthday+2",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
  {
    id: "bg_music",
    name: "Since We Met, It's Been Magic",
    type: "music",
    imageUrl: "https://via.placeholder.com/300?text=Music",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
  {
    id: "bg_love_album",
    name: "Love Album",
    type: "music",
    imageUrl: "https://via.placeholder.com/300?text=Love+Album",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
  {
    id: "bg_graduation1",
    name: "Happy Graduation",
    type: "graduation",
    imageUrl: "https://via.placeholder.com/300?text=Graduation+1",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: false,
  },
  {
    id: "bg_graduation2",
    name: "Happy Graduation (Stars)",
    type: "graduation",
    imageUrl: "https://via.placeholder.com/300?text=Graduation+2",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: false,
  },
  {
    id: "bg_graduation3",
    name: "Happy Graduation (Hearts)",
    type: "graduation",
    imageUrl: "https://via.placeholder.com/300?text=Graduation+3",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: false,
  },
  {
    id: "bg_harmony",
    name: "Harmony",
    type: "music",
    imageUrl: "https://via.placeholder.com/300?text=Harmony",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
  {
    id: "bg_adoration",
    name: "Adoration",
    type: "birthday",
    imageUrl: "https://via.placeholder.com/300?text=Adoration",
    hasTitle: true,
    hasDate: true,
    hasNames: true,
    hasSong: true,
  },
];
