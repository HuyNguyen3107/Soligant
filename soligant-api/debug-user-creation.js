// Debug script để test tạo user với token hiện tại
const axios = require("axios");

const API_BASE_URL = "http://localhost:3000/api";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY5Zjk5MWRjLTg5NWYtNGI1NS05YzUwLTg1NmZjYzU2MjJjMCIsImVtYWlsIjoiYWRtaW5Ac29saWdhbnQuY29tIiwiaWF0IjoxNzQ5OTY4OTQzLCJleHAiOjE3NTAwNTUzNDN9.pPruL2Evm_k96tWQUSg9ksIuQPY7vcFa2FeHziZZ2C0";

async function debugCreateUser() {
  console.log("🚀 Starting comprehensive user creation debug...\n");

  // 1. Test server connection
  console.log("1️⃣ Testing server connection...");
  try {
    const response = await axios.get("http://localhost:3000");
    console.log("✅ Server is running");
  } catch (error) {
    console.log("❌ Server connection failed:", error.message);
    console.log("Please start the server with: npm start");
    return;
  }
  // 2. Test auth endpoint
  console.log("\n2️⃣ Testing authentication...");
  try {
    const authResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    console.log("✅ Auth successful");
    console.log("👤 Current user:", authResponse.data.user?.full_name);
    console.log("🔑 Permissions:", authResponse.data.user?.permissions);

    // Check if user has create permission
    const permissions = authResponse.data.user?.permissions || [];
    if (!permissions.includes("users.create")) {
      console.log("❌ User does not have users.create permission");
      console.log("Available permissions:", permissions);
      return;
    }
    console.log("✅ User has users.create permission");
  } catch (error) {
    console.log("❌ Auth failed:", error.response?.data || error.message);
    return;
  }

  // 3. Test roles endpoint
  console.log("\n3️⃣ Getting available roles...");
  try {
    const rolesResponse = await axios.get(`${API_BASE_URL}/roles`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    console.log("✅ Roles fetched successfully");
    const roles = rolesResponse.data.roles || [];
    console.log(
      "📋 Available roles:",
      roles.map((r) => r.name)
    );

    if (roles.length === 0) {
      console.log("⚠️ No roles available - this might cause issues");
    }
  } catch (error) {
    console.log(
      "❌ Failed to get roles:",
      error.response?.data || error.message
    );
  }

  // 4. Test create user
  console.log("\n4️⃣ Testing user creation...");
  const timestamp = Date.now();
  const testUser = {
    email: `testuser${timestamp}@soligant.com`,
    password: "testpassword123",
    full_name: `Test User ${timestamp}`,
    phone: "0123456789",
    roles: ["employee"], // Use existing role instead of 'user'
    is_active: true,
  };

  console.log("📝 User data to create:");
  console.log(JSON.stringify(testUser, null, 2));

  try {
    const createResponse = await axios.post(`${API_BASE_URL}/users`, testUser, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ User created successfully!");
    console.log("👤 Created user:", createResponse.data);
  } catch (error) {
    console.log("❌ User creation failed");
    console.log("Status:", error.response?.status);
    console.log("Status Text:", error.response?.statusText);
    console.log("Error Data:", JSON.stringify(error.response?.data, null, 2));
    console.log("Request Headers:", error.config?.headers);

    // Additional debugging
    if (error.response?.status === 400) {
      console.log("\n🔍 This is a validation error. Check required fields:");
      console.log("- email (required, unique)");
      console.log("- password (required)");
      console.log("- full_name (required)");
    } else if (error.response?.status === 401) {
      console.log("\n🔍 Authentication error. Token might be expired.");
    } else if (error.response?.status === 403) {
      console.log(
        "\n🔍 Permission error. User might not have users.create permission."
      );
    } else if (error.response?.status === 500) {
      console.log("\n🔍 Server error. Check backend logs.");
    }
  }

  console.log("\n✨ Debug completed");
}

debugCreateUser();
