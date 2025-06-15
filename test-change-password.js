// test-change-password.js
// Script test chức năng đổi mật khẩu cá nhân

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function testChangePassword() {
  try {
    console.log("🧪 Testing Change My Password Feature...\n");

    // 1. Login to get token
    console.log("1. Login to get authentication token...");
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "admin@soligant.com", // Sử dụng email admin có sẵn
      password: "admin123", // Mật khẩu mặc định
    });

    const token = loginResponse.data.access_token;
    console.log("✅ Login successful");
    console.log(`   Token: ${token.substring(0, 20)}...`);

    // 2. Test change password with correct current password
    console.log(
      "\n2. Testing change password with correct current password..."
    );
    try {
      const changePasswordResponse = await axios.put(
        `${API_BASE}/users/change-my-password`,
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

      console.log("✅ Change password successful");
      console.log(`   Response: ${changePasswordResponse.data.message}`);

      // 3. Test login with new password
      console.log("\n3. Testing login with new password...");
      const newLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: "admin@soligant.com",
        password: "newpassword123",
      });

      console.log("✅ Login with new password successful");
      const newToken = newLoginResponse.data.access_token;

      // 4. Change back to original password
      console.log("\n4. Changing back to original password...");
      await axios.put(
        `${API_BASE}/users/change-my-password`,
        {
          currentPassword: "newpassword123",
          newPassword: "admin123",
        },
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Password restored to original");
    } catch (error) {
      console.log("❌ Change password failed");
      console.log(
        `   Error: ${error.response?.data?.message || error.message}`
      );
    }

    // 5. Test with wrong current password
    console.log("\n5. Testing with wrong current password...");
    try {
      await axios.put(
        `${API_BASE}/users/change-my-password`,
        {
          currentPassword: "wrongpassword",
          newPassword: "newpassword123",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("❌ Should have failed with wrong current password");
    } catch (error) {
      console.log("✅ Correctly rejected wrong current password");
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    // 6. Test with same password
    console.log("\n6. Testing with same password...");
    try {
      await axios.put(
        `${API_BASE}/users/change-my-password`,
        {
          currentPassword: "admin123",
          newPassword: "admin123",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("❌ Should have failed with same password");
    } catch (error) {
      console.log("✅ Correctly rejected same password");
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    // 7. Test with short password
    console.log("\n7. Testing with short password...");
    try {
      await axios.put(
        `${API_BASE}/users/change-my-password`,
        {
          currentPassword: "admin123",
          newPassword: "123",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("❌ Should have failed with short password");
    } catch (error) {
      console.log("✅ Correctly rejected short password");
      console.log(`   Error: ${error.response?.data?.message}`);
    }

    console.log("\n🎉 All tests completed!");
  } catch (error) {
    console.log("❌ Test failed");
    console.log("Error details:", error.response?.data || error.message);
  }
}

// Run test
testChangePassword();
