// Simple test for change-my-password endpoint
const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

async function testChangeMyPasswordEndpoint() {
  try {
    console.log("🔧 Testing /api/users/change-my-password endpoint...\n");

    // Step 1: Login to get token
    console.log("1. Đăng nhập để lấy token...");
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "admin@soligant.com",
      password: "admin123",
    });

    if (!loginResponse.data.success) {
      throw new Error("Đăng nhập thất bại");
    }

    const token = loginResponse.data.accessToken;
    console.log("✅ Đăng nhập thành công");

    // Step 2: Test change password endpoint
    console.log("\n2. Test endpoint change-my-password...");

    const response = await axios.put(
      `${API_BASE_URL}/users/change-my-password`,
      {
        currentPassword: "admin123",
        newPassword: "newpassword123",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Endpoint hoạt động! Response:", response.data);

    // Step 3: Change back to original password
    console.log("\n3. Đổi về mật khẩu cũ...");

    await axios.put(
      `${API_BASE_URL}/users/change-my-password`,
      {
        currentPassword: "newpassword123",
        newPassword: "admin123",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Đổi về mật khẩu cũ thành công");
    console.log(
      "\n🎉 TEST PASSED! Chức năng đổi mật khẩu hoạt động bình thường."
    );
  } catch (error) {
    console.error("\n❌ TEST FAILED!");

    if (error.response) {
      console.error("HTTP Status:", error.response.status);
      console.error(
        "Response Data:",
        JSON.stringify(error.response.data, null, 2)
      );
      console.error("Request URL:", error.config?.url);
      console.error("Request Method:", error.config?.method?.toUpperCase());
    } else {
      console.error("Error:", error.message);
    }
  }
}

testChangeMyPasswordEndpoint();
