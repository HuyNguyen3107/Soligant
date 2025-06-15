// Debug script để test tạo user
const axios = require("axios");

const API_BASE_URL = "http://localhost:3000/api";

async function testCreateUser() {
  try {
    // 1. Login to get token
    console.log("🔐 Đăng nhập để lấy token...");
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "admin@soligant.com",
      password: "admin123",
    });
    console.log("✅ Đăng nhập thành công");
    console.log("📝 Login response:", loginResponse.data);
    const token = loginResponse.data.tokens.accessToken;

    // 2. Get current user info
    console.log("👤 Lấy thông tin user hiện tại...");
    const currentUserResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ User hiện tại:", currentUserResponse.data.full_name);
    console.log("📜 Permissions:", currentUserResponse.data.permissions);

    // 3. Get roles list
    console.log("🎭 Lấy danh sách roles...");
    const rolesResponse = await axios.get(`${API_BASE_URL}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(
      "✅ Roles có sẵn:",
      rolesResponse.data.roles.map((r) => r.name)
    );

    // 4. Test create user
    console.log("👤 Test tạo user mới...");
    const newUser = {
      email: `test${Date.now()}@soligant.com`,
      password: "test123456",
      full_name: "Test User " + Date.now(),
      phone: "0123456789",
      roles: ["user"],
      is_active: true,
    };

    console.log("📝 Dữ liệu user mới:", newUser);

    const createUserResponse = await axios.post(
      `${API_BASE_URL}/users`,
      newUser,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Tạo user thành công!");
    console.log("📄 User mới:", createUserResponse.data);
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);

    if (error.response) {
      console.error("📊 Status:", error.response.status);
      console.error("📋 Headers:", error.response.headers);
      console.error("🔍 Data:", error.response.data);
    }
  }
}

// Chạy test
console.log("🚀 Bắt đầu test tạo user...");
testCreateUser();
