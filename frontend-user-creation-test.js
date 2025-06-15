// frontend-user-creation-test.js - Script để test tính năng tạo user trên frontend

console.log("🚀 Frontend User Creation Test");
console.log("===============================");

// Test Redux store và actions
const testReduxStore = () => {
  console.log("\n📦 Testing Redux Store...");

  // Check if Redux store is available
  if (typeof window !== "undefined" && window.__store__) {
    const store = window.__store__;
    console.log("✅ Redux store found");
    console.log("Current state keys:", Object.keys(store.getState()));

    // Check user slice
    const userState = store.getState().users;
    if (userState) {
      console.log("✅ User slice found");
      console.log("User state:", {
        usersCount: userState.users?.length || 0,
        loading: userState.loading,
        error: userState.error,
        total: userState.total,
      });
    } else {
      console.log("❌ User slice not found");
    }

    // Check role slice
    const roleState = store.getState().roles;
    if (roleState) {
      console.log("✅ Role slice found");
      console.log("Role state:", {
        rolesCount: roleState.roles?.length || 0,
        loading: roleState.loading,
        error: roleState.error,
      });
    } else {
      console.log("❌ Role slice not found");
    }

    return store;
  } else {
    console.log("❌ Redux store not found");
    console.log(
      "Make sure Redux DevTools is enabled or expose store to window"
    );
    return null;
  }
};

// Test API calls directly
const testAPIDirectly = async () => {
  console.log("\n🌐 Testing API Directly...");

  // Get auth token
  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.token || parsed.accessToken;
      } catch (e) {
        console.log("Failed to parse auth data");
      }
    }
    return null;
  };

  const token = getAuthToken();
  if (!token) {
    console.log("❌ No authentication token found");
    console.log("Please login first");
    return;
  }

  console.log("✅ Auth token found");

  const baseURL = "http://localhost:5000/api";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // Test get users
    console.log("Testing GET /users...");
    const usersResponse = await fetch(`${baseURL}/users`, { headers });

    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log("✅ GET /users success");
      console.log("Users data structure:", {
        success: usersData.success,
        dataCount: usersData.data?.length || 0,
        meta: usersData.meta,
      });
    } else {
      console.log("❌ GET /users failed:", usersResponse.status);
    }

    // Test get roles
    console.log("Testing GET /roles...");
    const rolesResponse = await fetch(`${baseURL}/roles`, { headers });

    if (rolesResponse.ok) {
      const rolesData = await rolesResponse.json();
      console.log("✅ GET /roles success");
      console.log("Roles data:", rolesData.data?.map((r) => r.name) || []);

      // Test create user with available roles
      if (rolesData.data && rolesData.data.length > 0) {
        console.log("Testing POST /users...");

        const testUser = {
          email: `testuser${Date.now()}@example.com`,
          password: "testpassword123",
          full_name: "Test User Frontend",
          phone: "0123456789",
          roles: [rolesData.data[0].name], // Use first available role
          is_active: true,
        };

        const createResponse = await fetch(`${baseURL}/users`, {
          method: "POST",
          headers,
          body: JSON.stringify(testUser),
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          console.log("✅ POST /users success");
          console.log("Created user:", {
            id: createData.data?.id,
            email: createData.data?.email,
            full_name: createData.data?.full_name,
          });
        } else {
          const errorData = await createResponse.json();
          console.log("❌ POST /users failed:", createResponse.status);
          console.log("Error:", errorData);
        }
      }
    } else {
      console.log("❌ GET /roles failed:", rolesResponse.status);
    }
  } catch (error) {
    console.log("❌ API test error:", error);
  }
};

// Test form submission simulation
const testFormSubmission = () => {
  console.log("\n📝 Testing Form Submission...");

  // Look for create user modal
  const modal =
    document.querySelector('[data-testid="create-user-modal"]') ||
    document.querySelector(".fixed.inset-0"); // Common modal class

  if (modal) {
    console.log("✅ Modal found");

    // Look for form elements
    const emailInput = modal.querySelector('input[type="email"]');
    const passwordInput = modal.querySelector('input[type="password"]');
    const nameInput = modal.querySelector('input[type="text"]');
    const submitButton = modal.querySelector('button[type="submit"]');

    console.log("Form elements found:", {
      email: !!emailInput,
      password: !!passwordInput,
      name: !!nameInput,
      submit: !!submitButton,
    });

    if (emailInput && passwordInput && nameInput) {
      console.log("✅ All required form elements found");
      console.log("Form is ready for testing");
    } else {
      console.log("❌ Some form elements missing");
    }
  } else {
    console.log("❌ Create user modal not found");
    console.log("Make sure to open the create user modal first");
  }
};

// Main test function
const runAllTests = async () => {
  console.log("🔍 Running all frontend tests...");

  // Test 1: Redux store
  const store = testReduxStore();

  // Test 2: API calls
  await testAPIDirectly();

  // Test 3: Form elements
  testFormSubmission();

  console.log("\n🏁 All tests completed");
  console.log("\nNext steps:");
  console.log("1. Open UserManagement page");
  console.log('2. Click "Tạo người dùng mới" button');
  console.log("3. Fill form and watch console for logs");
  console.log("4. Submit form and check network tab");

  return { store };
};

// Auto-run if in browser
if (typeof window !== "undefined") {
  window.testUserCreation = runAllTests;
  window.testReduxStore = testReduxStore;
  window.testAPIDirectly = testAPIDirectly;
  window.testFormSubmission = testFormSubmission;

  console.log("🎯 Functions available:");
  console.log("- testUserCreation() - Run all tests");
  console.log("- testReduxStore() - Test Redux store");
  console.log("- testAPIDirectly() - Test API calls");
  console.log("- testFormSubmission() - Test form elements");
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    runAllTests,
    testReduxStore,
    testAPIDirectly,
    testFormSubmission,
  };
}
