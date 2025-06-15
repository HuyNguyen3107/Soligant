// Debug frontend user creation
// Paste this into browser console on UserManagement page

console.log("🔍 Frontend User Creation Debug");

// Check if userAPI is properly imported
console.log("1. Checking userAPI import...");
import("../../api/userAPI.js")
  .then((userAPI) => {
    console.log("✅ userAPI imported successfully");
    console.log("Available functions:", Object.keys(userAPI));
    console.log("createUser type:", typeof userAPI.createUser);
  })
  .catch((error) => {
    console.error("❌ Failed to import userAPI:", error);
  });

// Check Redux store state
console.log("2. Checking Redux store...");
const store =
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__.getState();
if (store) {
  console.log("✅ Redux store accessible");
  console.log("Auth state:", store.auth);
  console.log("User state:", store.users);
} else {
  console.log("❌ Redux DevTools not available");
}

// Check if token exists
console.log("3. Checking auth token...");
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("session_token="));
if (token) {
  console.log("✅ Session token found");
  console.log("Token:", token.substring(0, 30) + "...");
} else {
  console.log("❌ No session token found");
}

// Test API call directly
console.log("4. Testing direct API call...");
const testUser = {
  email: `test${Date.now()}@soligant.com`,
  password: "test123456",
  full_name: "Test User Direct",
  phone: "0123456789",
  roles: ["employee"],
  is_active: true,
};

fetch("http://localhost:3000/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token?.split("=")[1],
  },
  body: JSON.stringify(testUser),
})
  .then((response) => {
    console.log("✅ Direct API call response:", response.status);
    return response.json();
  })
  .then((data) => {
    console.log("✅ Direct API call data:", data);
  })
  .catch((error) => {
    console.error("❌ Direct API call error:", error);
  });

console.log("📝 Run this in browser console on UserManagement page");
