const axios = require("axios");

const API_BASE_URL = "http://localhost:3000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY5Zjk5MWRjLTg5NWYtNGI1NS05YzUwLTg1NmZjYzU2MjJjMCIsImVtYWlsIjoiYWRtaW5Ac29saWdhbnQuY29tIiwiaWF0IjoxNzQ5OTY4OTQzLCJleHAiOjE3NTAwNTUzNDN9.pPruL2Evm_k96tWQUSg9ksIuQPY7vcFa2FeHziZZ2C0";

async function testCreateUser() {
  try {
    console.log("🧪 Testing create user...");

    const userData = {
      email: `test${Date.now()}@example.com`,
      password: "Test123456",
      full_name: "Test User",
      phone: "0123456789",
      roles: ["user"],
      is_active: true,
    };

    console.log("📤 Sending request with data:", userData);
    console.log("🔑 Using token:", token.substring(0, 50) + "...");

    const response = await axios.post(`${API_BASE_URL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ User created successfully!");
    console.log("📥 Response data:", response.data);
  } catch (error) {
    console.error("❌ Error creating user:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Error Data:", error.response?.data);
    console.error("Full Error:", error.message);
  }
}

// Test if server is running first
async function testServer() {
  try {
    const response = await axios.get(`${API_BASE_URL.replace("/api", "")}/`);
    console.log("✅ Server is running");
    return true;
  } catch (error) {
    console.error("❌ Server is not running or health check failed");
    console.error("Make sure to start the server with: npm start");
    return false;
  }
}

async function main() {
  console.log("🚀 Starting user creation test...");

  const serverRunning = await testServer();
  if (!serverRunning) {
    return;
  }

  await testCreateUser();
}

main();
