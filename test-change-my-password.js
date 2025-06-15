// Test script cho chức năng đổi mật khẩu cá nhân
require("dotenv").config();
const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

// Test data
const testUser = {
  email: "admin@soligant.com",
  password: "admin123",
};

const newPassword = "newpassword123";

async function testChangeMyPassword() {
  try {
    console.log("🔧 Testing Change My Password functionality...\n");

    // Step 1: Login to get token
    console.log("1. Đăng nhập để lấy token...");
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });

    if (!loginResponse.data.success) {
      throw new Error("Đăng nhập thất bại: " + loginResponse.data.message);
    }

    const token = loginResponse.data.accessToken;
    console.log("✅ Đăng nhập thành công");

    // Step 2: Change password
    console.log("\n2. Đổi mật khẩu cá nhân...");
    const changePasswordResponse = await axios.put(
      `${API_BASE_URL}/users/change-my-password`,
      {
        currentPassword: testUser.password,
        newPassword: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!changePasswordResponse.data.success) {
      throw new Error(
        "Đổi mật khẩu thất bại: " + changePasswordResponse.data.message
      );
    }

    console.log(
      "✅ Đổi mật khẩu thành công:",
      changePasswordResponse.data.message
    );

    // Step 3: Test login with new password
    console.log("\n3. Thử đăng nhập với mật khẩu mới...");
    const loginWithNewPasswordResponse = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email: testUser.email,
        password: newPassword,
      }
    );

    if (!loginWithNewPasswordResponse.data.success) {
      throw new Error(
        "Đăng nhập với mật khẩu mới thất bại: " +
          loginWithNewPasswordResponse.data.message
      );
    }

    console.log("✅ Đăng nhập với mật khẩu mới thành công");

    // Step 4: Change password back to original
    console.log("\n4. Đổi mật khẩu về ban đầu...");
    const revertPasswordResponse = await axios.put(
      `${API_BASE_URL}/users/change-my-password`,
      {
        currentPassword: newPassword,
        newPassword: testUser.password,
      },
      {
        headers: {
          Authorization: `Bearer ${loginWithNewPasswordResponse.data.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!revertPasswordResponse.data.success) {
      throw new Error(
        "Đổi mật khẩu về ban đầu thất bại: " +
          revertPasswordResponse.data.message
      );
    }

    console.log("✅ Đổi mật khẩu về ban đầu thành công");

    console.log(
      "\n🎉 Tất cả test đều PASS! Chức năng đổi mật khẩu cá nhân hoạt động bình thường."
    );
  } catch (error) {
    console.error("\n❌ Test FAILED!");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Test validation cases
async function testValidationCases() {
  try {
    console.log("\n🔧 Testing validation cases...\n");

    // Get token first
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });

    const token = loginResponse.data.accessToken;

    // Test case 1: Missing current password
    console.log("Test 1: Thiếu mật khẩu hiện tại...");
    try {
      await axios.put(
        `${API_BASE_URL}/users/change-my-password`,
        {
          newPassword: "newpass123",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("❌ Should have failed");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("✅ Correctly rejected missing current password");
      } else {
        throw error;
      }
    }

    // Test case 2: Wrong current password
    console.log("\nTest 2: Mật khẩu hiện tại sai...");
    try {
      await axios.put(
        `${API_BASE_URL}/users/change-my-password`,
        {
          currentPassword: "wrongpassword",
          newPassword: "newpass123",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("❌ Should have failed");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("✅ Correctly rejected wrong current password");
      } else {
        throw error;
      }
    }

    // Test case 3: Short new password
    console.log("\nTest 3: Mật khẩu mới quá ngắn...");
    try {
      await axios.put(
        `${API_BASE_URL}/users/change-my-password`,
        {
          currentPassword: testUser.password,
          newPassword: "123",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("❌ Should have failed");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("✅ Correctly rejected short password");
      } else {
        throw error;
      }
    }

    console.log("\n🎉 Tất cả validation test đều PASS!");
  } catch (error) {
    console.error("\n❌ Validation test FAILED!");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Run tests
async function runAllTests() {
  await testChangeMyPassword();
  await testValidationCases();
}

runAllTests();
