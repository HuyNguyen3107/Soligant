// test-delete-user.js - Test DELETE user API

const testDeleteUser = async () => {
  console.log("🗑️ Testing Delete User API");
  console.log("===========================");

  const baseURL = "http://localhost:5000/api";

  // Get auth token from localStorage (trong browser)
  const getAuthToken = () => {
    if (typeof localStorage !== "undefined") {
      const authData = localStorage.getItem("auth");
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          return parsed.token || parsed.accessToken;
        } catch (e) {
          console.log("Failed to parse auth data");
        }
      }
    }
    return null;
  };

  const token = getAuthToken();
  if (!token) {
    console.log("❌ No authentication token found");
    console.log("Please login first to get authentication token");
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // First, create a test user to delete
    console.log("\n1. Creating test user to delete...");

    const testUserData = {
      email: `testdelete${Date.now()}@example.com`,
      password: "testpassword123",
      full_name: "Test Delete User",
      phone: "0123456789",
      roles: [],
      is_active: true,
    };

    const createResponse = await fetch(`${baseURL}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(testUserData),
    });

    if (!createResponse.ok) {
      console.log("❌ Failed to create test user:", createResponse.status);
      return;
    }

    const createData = await createResponse.json();
    const testUserId = createData.data?.id;

    if (!testUserId) {
      console.log("❌ No user ID returned from create");
      return;
    }

    console.log("✅ Test user created with ID:", testUserId);

    // Now test delete
    console.log("\n2. Testing DELETE /users/:id...");

    const deleteResponse = await fetch(`${baseURL}/users/${testUserId}`, {
      method: "DELETE",
      headers,
    });

    if (deleteResponse.ok) {
      const deleteData = await deleteResponse.json();
      console.log("✅ DELETE /users/:id - Success");
      console.log("Response:", deleteData);

      // Verify user is actually deleted by trying to get it
      console.log("\n3. Verifying user deletion...");

      const getResponse = await fetch(`${baseURL}/users/${testUserId}`, {
        method: "GET",
        headers,
      });

      if (getResponse.status === 404) {
        console.log("✅ User successfully deleted (404 when trying to fetch)");
      } else {
        console.log(
          "⚠️ User might not be deleted (status:",
          getResponse.status,
          ")"
        );
      }
    } else {
      const errorData = await deleteResponse.json();
      console.log("❌ DELETE /users/:id - Failed:", deleteResponse.status);
      console.log("Error:", errorData);
    }
  } catch (error) {
    console.log("❌ Test failed with error:", error);
  }

  console.log("\n===========================");
  console.log("🏁 Delete test completed");
};

// Test invalid scenarios
const testDeleteEdgeCases = async () => {
  console.log("\n🧪 Testing Delete Edge Cases");
  console.log("============================");

  const baseURL = "http://localhost:5000/api";
  const token = getAuthToken();

  if (!token) {
    console.log("❌ No auth token");
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // Test 1: Delete non-existent user
    console.log("\n1. Testing delete non-existent user...");

    const fakeId = 99999;
    const deleteResponse = await fetch(`${baseURL}/users/${fakeId}`, {
      method: "DELETE",
      headers,
    });

    if (deleteResponse.status === 404) {
      console.log("✅ Correctly returned 404 for non-existent user");
    } else {
      console.log(
        "❌ Unexpected status for non-existent user:",
        deleteResponse.status
      );
    }

    // Test 2: Delete without auth
    console.log("\n2. Testing delete without authentication...");

    const noAuthResponse = await fetch(`${baseURL}/users/1`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (noAuthResponse.status === 401 || noAuthResponse.status === 403) {
      console.log("✅ Correctly rejected request without auth");
    } else {
      console.log("❌ Unexpected status without auth:", noAuthResponse.status);
    }
  } catch (error) {
    console.log("❌ Edge case test failed:", error);
  }
};

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof localStorage !== "undefined") {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.token || parsed.accessToken;
      } catch (e) {
        console.log("Failed to parse auth data");
      }
    }
  }
  return null;
};

// Make functions available in browser
if (typeof window !== "undefined") {
  window.testDeleteUser = testDeleteUser;
  window.testDeleteEdgeCases = testDeleteEdgeCases;

  console.log("🎯 Delete test functions available:");
  console.log("- testDeleteUser() - Test full delete flow");
  console.log("- testDeleteEdgeCases() - Test edge cases");
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testDeleteUser, testDeleteEdgeCases };
}

// Auto-run in Node.js
if (typeof require !== "undefined" && require.main === module) {
  testDeleteUser();
}
