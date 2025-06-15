// Simple frontend test script
// Add this to browser console when on UserManagement page

console.log("=== FRONTEND DEBUG TEST ===");

// 1. Test Redux store
console.log("1. Testing Redux store...");
try {
  const state = window.store?.getState();
  if (state) {
    console.log("✅ Redux store accessible");
    console.log(
      "Auth state:",
      state.auth?.currentUser ? "Logged in" : "Not logged in"
    );
    console.log("Users state:", state.users ? "Available" : "Missing");
    console.log("Roles state:", state.roles ? "Available" : "Missing");
  } else {
    console.log("❌ Redux store not accessible");
  }
} catch (e) {
  console.log("❌ Redux store error:", e.message);
}

// 2. Test userAPI import
console.log("\n2. Testing userAPI...");
try {
  // This will only work if we can access the module
  const userAPITest = typeof window.createUser === "function";
  console.log(
    "createUser function:",
    userAPITest ? "Available" : "Not available"
  );
} catch (e) {
  console.log("❌ userAPI test error:", e.message);
}

// 3. Test form elements
console.log("\n3. Testing form elements...");
const modal =
  document.querySelector('[role="dialog"]') ||
  document.querySelector(".fixed.inset-0");
const form = document.querySelector("form");
const emailInput = document.querySelector('input[type="email"]');
const submitButton = document.querySelector('button[type="submit"]');

console.log("Modal found:", !!modal);
console.log("Form found:", !!form);
console.log("Email input found:", !!emailInput);
console.log("Submit button found:", !!submitButton);

if (form) {
  console.log("Form onSubmit:", typeof form.onsubmit);
  console.log("Form has event listeners:", form.hasEventListeners);
}

// 4. Manual form submit test
console.log("\n4. Manual submit test...");
if (form && submitButton) {
  console.log("Form and submit button found. You can manually test by:");
  console.log("1. Fill the form");
  console.log("2. Click submit button");
  console.log("3. Watch console for logs");

  // Add click listener to submit button for debugging
  const originalClick = submitButton.onclick;
  submitButton.onclick = function (e) {
    console.log("🔥 Submit button clicked!");
    if (originalClick) {
      return originalClick.call(this, e);
    }
  };

  // Add submit listener to form
  const originalSubmit = form.onsubmit;
  form.onsubmit = function (e) {
    console.log("🔥 Form submitted!");
    if (originalSubmit) {
      return originalSubmit.call(this, e);
    }
  };

  console.log("✅ Debug listeners added to form");
} else {
  console.log("❌ Form or submit button not found");
}

console.log("\n=== DEBUG TEST COMPLETE ===");
console.log("Now try to create a user and watch the console logs.");
