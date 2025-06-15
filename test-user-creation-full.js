// test-user-creation-full.js - Test toàn bộ flow tạo user từ frontend đến backend

const testUserCreation = async () => {
  console.log("🚀 Testing Full User Creation Flow");
  console.log("=====================================");

  // Test 1: Check API endpoints
  console.log("\n1. Testing API Endpoints...");

  try {
    // Test get users endpoint
    const usersResponse = await fetch("http://localhost:5000/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN_HERE", // Replace with actual token
      },
    });

    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log("✅ GET /api/users - Success");
      console.log(`   Total users: ${usersData.data?.length || 0}`);
    } else {
      console.log("❌ GET /api/users - Failed:", usersResponse.status);
    }
  } catch (error) {
    console.log("❌ GET /api/users - Error:", error.message);
  }

  // Test 2: Create new user via API
  console.log("\n2. Testing Create User API...");

  const testUserData = {
    email: `testuser${Date.now()}@example.com`,
    password: "testpassword123",
    full_name: "Test User Full Name",
    phone: "0123456789",
    roles: [], // Empty roles for now
    is_active: true,
  };

  try {
    const createResponse = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN_HERE", // Replace with actual token
      },
      body: JSON.stringify(testUserData),
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log("✅ POST /api/users - Success");
      console.log("   Created user:", {
        id: createData.data?.id,
        email: createData.data?.email,
        full_name: createData.data?.full_name,
      });
    } else {
      const errorData = await createResponse.json();
      console.log("❌ POST /api/users - Failed:", createResponse.status);
      console.log("   Error:", errorData.message);
    }
  } catch (error) {
    console.log("❌ POST /api/users - Error:", error.message);
  }

  // Test 3: Check roles endpoint
  console.log("\n3. Testing Roles API...");

  try {
    const rolesResponse = await fetch("http://localhost:5000/api/roles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN_HERE", // Replace with actual token
      },
    });

    if (rolesResponse.ok) {
      const rolesData = await rolesResponse.json();
      console.log("✅ GET /api/roles - Success");
      console.log(`   Total roles: ${rolesData.data?.length || 0}`);

      if (rolesData.data && rolesData.data.length > 0) {
        console.log("   Available roles:");
        rolesData.data.forEach((role) => {
          console.log(`   - ${role.name} (${role.code})`);
        });
      }
    } else {
      console.log("❌ GET /api/roles - Failed:", rolesResponse.status);
    }
  } catch (error) {
    console.log("❌ GET /api/roles - Error:", error.message);
  }

  console.log("\n=====================================");
  console.log("🏁 Test Complete");
  console.log("\nNext Steps:");
  console.log("1. Replace YOUR_TOKEN_HERE with actual JWT token");
  console.log("2. Make sure backend server is running on port 5000");
  console.log("3. Test the frontend UI with browser dev tools");
  console.log("4. Check console logs for Redux actions and API calls");
};

// Helper function to get auth token from localStorage (for browser testing)
const getBrowserToken = () => {
  if (typeof localStorage !== "undefined") {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        return parsed.token || parsed.accessToken;
      } catch (e) {
        console.log("Failed to parse auth from localStorage");
      }
    }
  }
  return null;
};

// Browser testing function
const testInBrowser = async () => {
  console.log("🌐 Browser Testing Mode");

  const token = getBrowserToken();
  if (!token) {
    console.log("❌ No auth token found in localStorage");
    console.log("Please login first to get authentication token");
    return;
  }

  console.log("✅ Found auth token, proceeding with tests...");

  // Test with actual token
  // ... rest of the tests with real token
};

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testUserCreation, testInBrowser };
} else {
  // Browser environment
  window.testUserCreation = testUserCreation;
  window.testInBrowser = testInBrowser;
}

// Auto-run if called directly
if (typeof require !== "undefined" && require.main === module) {
  testUserCreation();
}
