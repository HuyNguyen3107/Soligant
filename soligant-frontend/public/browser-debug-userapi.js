// browser-debug-userapi.js - Script để debug trong browser
console.log("🔍 Browser UserAPI Debug");

// Function to test userAPI import
const testUserAPIInBrowser = async () => {
  try {
    console.log("📦 Testing userAPI import in browser...");

    // Check if we can access the userAPI through Redux store
    if (window.__store__) {
      const store = window.__store__;
      console.log("✅ Redux store found");

      // Check if userSlice exists
      const state = store.getState();
      if (state.users) {
        console.log("✅ User slice exists in store");
        console.log("User state:", {
          usersCount: state.users.users?.length || 0,
          loading: state.users.loading,
          error: state.users.error,
        });
      } else {
        console.log("❌ User slice not found in store");
      }
    } else {
      console.log("❌ Redux store not accessible");
    }

    // Try to dispatch createUser action
    console.log("🚀 Testing createUser dispatch...");

    // Mock user data
    const testUserData = {
      email: `test-${Date.now()}@example.com`,
      password: "testpass123",
      full_name: "Test User Browser",
      phone: "0123456789",
      roles: [],
      is_active: true,
    };

    console.log("Test user data:", testUserData);

    // Try to access createUser action
    if (window.store && window.store.dispatch) {
      console.log("✅ Store dispatch available");

      // Note: This requires the createUser action to be imported in the component
      console.log(
        "To test createUser, use the form in UserManagement component"
      );
    } else {
      console.log("ℹ️ Store dispatch not directly accessible");
      console.log("Use the UserManagement component form to test createUser");
    }
  } catch (error) {
    console.log("❌ Error testing userAPI:", error);
  }
};

// Function to check network requests
const monitorNetworkRequests = () => {
  console.log("🌐 Monitoring network requests...");

  // Override fetch to monitor requests
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    console.log("📡 Fetch request:", args[0]);
    return originalFetch
      .apply(this, args)
      .then((response) => {
        console.log("📡 Fetch response:", response.status, response.url);
        return response;
      })
      .catch((error) => {
        console.log("📡 Fetch error:", error);
        throw error;
      });
  };

  console.log("✅ Network monitoring enabled");
};

// Function to test form submission
const testFormSubmission = () => {
  console.log("📝 Looking for user creation form...");

  // Look for the create user modal
  const modal = document.querySelector('[data-testid="create-user-modal"]');
  if (modal) {
    console.log("✅ Create user modal found");

    const form = modal.querySelector("form");
    if (form) {
      console.log("✅ Form found in modal");

      // Check form inputs
      const inputs = {
        email: form.querySelector('input[type="email"]'),
        password: form.querySelector('input[type="password"]'),
        name: form.querySelector('input[type="text"]'),
        phone: form.querySelector('input[type="tel"]'),
        roles: form.querySelector("select"),
        submit: form.querySelector('button[type="submit"]'),
      };

      console.log(
        "Form inputs found:",
        Object.keys(inputs).filter((key) => inputs[key])
      );

      // Add event listener to form
      form.addEventListener("submit", (e) => {
        console.log("🚀 Form submitted!");
        console.log("Form data:", new FormData(form));

        // Don't prevent default, let it go through
      });

      console.log("✅ Form submit listener added");
    } else {
      console.log("❌ Form not found in modal");
    }
  } else {
    console.log("❌ Create user modal not found");
    console.log('Open the modal first by clicking "Tạo người dùng mới"');
  }
};

// Main test function
const runBrowserTests = () => {
  console.log("🎯 Running browser tests for UserAPI...");

  testUserAPIInBrowser();
  monitorNetworkRequests();
  testFormSubmission();

  console.log("\n📋 Instructions:");
  console.log("1. Open UserManagement page");
  console.log('2. Click "Tạo người dùng mới"');
  console.log("3. Fill the form");
  console.log("4. Submit and watch console");
  console.log("5. Check Network tab for API calls");
};

// Make functions available globally
window.testUserAPI = testUserAPIInBrowser;
window.monitorNetwork = monitorNetworkRequests;
window.testForm = testFormSubmission;
window.runBrowserTests = runBrowserTests;

console.log("🎯 Browser debug functions available:");
console.log("- runBrowserTests() - Run all tests");
console.log("- testUserAPI() - Test userAPI");
console.log("- monitorNetwork() - Monitor network requests");
console.log("- testForm() - Test form submission");

// Auto-run
runBrowserTests();
