// debug-imports.js - Test import/export functions
console.log("🔍 Testing Import/Export Issues");

// Test 1: Check if userAPI functions are properly exported
const testUserAPIImports = async () => {
  console.log("\n📦 Testing userAPI imports...");

  try {
    // Try to import userAPI
    const userAPI = await import("../api/userAPI.js");
    console.log("✅ userAPI imported successfully");
    console.log("Available functions:", Object.keys(userAPI));

    // Check specific functions
    const requiredFunctions = [
      "createUser",
      "getUsers",
      "updateUser",
      "deleteUser",
    ];
    const missingFunctions = requiredFunctions.filter(
      (fn) => typeof userAPI[fn] !== "function"
    );

    if (missingFunctions.length === 0) {
      console.log("✅ All required functions available");
    } else {
      console.log("❌ Missing functions:", missingFunctions);
    }

    // Test createUser function specifically
    if (typeof userAPI.createUser === "function") {
      console.log("✅ createUser function is available");
      console.log(
        "Function definition:",
        userAPI.createUser.toString().substring(0, 100) + "..."
      );
    } else {
      console.log("❌ createUser function not found");
    }
  } catch (error) {
    console.log("❌ Error importing userAPI:", error);
  }
};

// Test 2: Check axiosClient
const testAxiosClient = async () => {
  console.log("\n🌐 Testing axiosClient...");

  try {
    const axiosClient = await import("../api/axiosClient.js");
    console.log("✅ axiosClient imported successfully");
    console.log("Default export type:", typeof axiosClient.default);

    if (axiosClient.default && axiosClient.default.get) {
      console.log("✅ axiosClient has HTTP methods");
      console.log("Base URL:", axiosClient.default.defaults?.baseURL);
    } else {
      console.log("❌ axiosClient missing HTTP methods");
    }
  } catch (error) {
    console.log("❌ Error importing axiosClient:", error);
  }
};

// Test 3: Check userSlice imports
const testUserSliceImports = async () => {
  console.log("\n🔄 Testing userSlice imports...");

  try {
    const userSlice = await import("../redux/features/userSlice.js");
    console.log("✅ userSlice imported successfully");
    console.log("Available exports:", Object.keys(userSlice));

    const requiredExports = [
      "createUser",
      "fetchUsers",
      "updateUser",
      "deleteUser",
    ];
    const missingExports = requiredExports.filter(
      (exp) => typeof userSlice[exp] !== "function"
    );

    if (missingExports.length === 0) {
      console.log("✅ All required async thunks available");
    } else {
      console.log("❌ Missing async thunks:", missingExports);
    }
  } catch (error) {
    console.log("❌ Error importing userSlice:", error);
  }
};

// Test 4: Simulate the actual import chain
const testImportChain = async () => {
  console.log("\n🔗 Testing full import chain...");

  try {
    // Step 1: Import userAPI
    console.log("Step 1: Importing userAPI...");
    const userAPI = await import("../api/userAPI.js");

    // Step 2: Check createUser function
    console.log("Step 2: Checking createUser function...");
    if (typeof userAPI.createUser !== "function") {
      throw new Error("userAPI.createUser is not a function");
    }

    // Step 3: Import userSlice
    console.log("Step 3: Importing userSlice...");
    const userSlice = await import("../redux/features/userSlice.js");

    // Step 4: Check createUser thunk
    console.log("Step 4: Checking createUser thunk...");
    if (typeof userSlice.createUser !== "function") {
      throw new Error("userSlice.createUser is not a function");
    }

    console.log("✅ Full import chain working correctly");
  } catch (error) {
    console.log("❌ Import chain failed:", error.message);
    console.log("Stack trace:", error.stack);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log("🚀 Running all import/export tests...\n");

  await testUserAPIImports();
  await testAxiosClient();
  await testUserSliceImports();
  await testImportChain();

  console.log("\n🏁 All tests completed");
  console.log(
    '\nIf tests pass but you still get "userAPI.createUser is not a function",'
  );
  console.log("the issue might be in the component import or Redux dispatch.");
};

// Export for browser usage
if (typeof window !== "undefined") {
  window.testImports = runAllTests;
  window.testUserAPIImports = testUserAPIImports;
  window.testAxiosClient = testAxiosClient;
  window.testUserSliceImports = testUserSliceImports;
  window.testImportChain = testImportChain;

  console.log("Available test functions:");
  console.log("- testImports() - Run all tests");
  console.log("- testUserAPIImports() - Test userAPI");
  console.log("- testAxiosClient() - Test axios client");
  console.log("- testUserSliceImports() - Test Redux slice");
  console.log("- testImportChain() - Test full import chain");
}

// Auto-run in Node.js
if (typeof require !== "undefined" && require.main === module) {
  runAllTests();
}

export {
  runAllTests,
  testUserAPIImports,
  testAxiosClient,
  testUserSliceImports,
  testImportChain,
};
