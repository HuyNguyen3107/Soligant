// quick-test-imports.js
console.log("🔍 Testing userAPI imports...");

// Test import userAPI
import userAPI from "./src/api/userAPI.js";

console.log("✅ userAPI imported successfully");
console.log("Available methods:", Object.keys(userAPI));

// Test createUser specifically
if (typeof userAPI.createUser === "function") {
  console.log("✅ createUser method is available");
  console.log("createUser type:", typeof userAPI.createUser);
} else {
  console.log("❌ createUser method is missing");
}

// Test other methods
const requiredMethods = [
  "getUsers",
  "getUserById",
  "createUser",
  "updateUser",
  "deleteUser",
];
const missingMethods = requiredMethods.filter(
  (method) => typeof userAPI[method] !== "function"
);

if (missingMethods.length === 0) {
  console.log("✅ All required methods are available");
} else {
  console.log("❌ Missing methods:", missingMethods);
}

console.log("🏁 Test completed");
