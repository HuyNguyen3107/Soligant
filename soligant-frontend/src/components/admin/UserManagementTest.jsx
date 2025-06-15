// src/components/admin/UserManagementTest.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
} from "../../redux/features/userSlice";
import { fetchRoles, selectRoles } from "../../redux/features/roleSlice";

const UserManagementTest = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, success, message) => {
    setTestResults((prev) => [
      ...prev,
      { test, success, message, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const runTest = async (testName, testFunction) => {
    try {
      await testFunction();
      addTestResult(testName, true, "Passed");
    } catch (error) {
      addTestResult(testName, false, error.message);
    }
  };

  const testFetchUsers = async () => {
    const result = await dispatch(fetchUsers({ page: 1, limit: 10 })).unwrap();
    if (!result.users) throw new Error("No users returned");
  };

  const testFetchRoles = async () => {
    const result = await dispatch(fetchRoles()).unwrap();
    if (!result.roles) throw new Error("No roles returned");
  };

  const testCreateUser = async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: "password123",
      full_name: "Test User",
      phone: "0123456789",
      roles: ["Staff"],
      is_active: true,
    };
    const result = await dispatch(createUser(userData)).unwrap();
    if (!result.user) throw new Error("User not created");
  };

  const testUpdateUser = async () => {
    if (users.length === 0) throw new Error("No users to update");
    const user = users[0];
    const updateData = {
      full_name: `Updated ${user.full_name}`,
      is_active: user.is_active,
    };
    const result = await dispatch(
      updateUser({ id: user.id, userData: updateData })
    ).unwrap();
    if (!result.user) throw new Error("User not updated");
  };

  const testChangePassword = async () => {
    if (users.length === 0) throw new Error("No users to change password");
    const user = users[0];
    const result = await dispatch(
      changePassword({ id: user.id, password: "newpassword123" })
    ).unwrap();
    if (!result.message) throw new Error("Password not changed");
  };

  const runAllTests = async () => {
    setTestResults([]);

    await runTest("Fetch Users", testFetchUsers);
    await runTest("Fetch Roles", testFetchRoles);
    await runTest("Create User", testCreateUser);
    await runTest("Update User", testUpdateUser);
    await runTest("Change Password", testChangePassword);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">User Management API Test</h2>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Running Tests..." : "Run All Tests"}
          </button>

          <button
            onClick={() => dispatch(fetchUsers())}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Fetch Users
          </button>

          <button
            onClick={() => dispatch(fetchRoles())}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Fetch Roles
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    result.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span className="font-medium">{result.test}</span>:{" "}
                  {result.message}
                  <span className="text-sm opacity-75 ml-2">
                    ({result.timestamp})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users List */}
        {users.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Users ({users.length})
            </h3>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="p-2 border rounded">
                  <div className="font-medium">{user.full_name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-sm">
                    Roles: {user.roles?.join(", ") || "No roles"}
                  </div>
                  <div className="text-sm">
                    Status: {user.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roles List */}
        {roles.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Roles ({roles.length})
            </h3>
            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role.id} className="p-2 border rounded">
                  <div className="font-medium">{role.name}</div>
                  <div className="text-sm text-gray-600">
                    {role.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Info */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">API Endpoints</h3>
          <div className="text-sm space-y-1">
            <div>GET /api/users - Fetch users list</div>
            <div>POST /api/users - Create new user</div>
            <div>PUT /api/users/:id - Update user</div>
            <div>PUT /api/users/:id/password - Change password</div>
            <div>DELETE /api/users/:id - Delete user</div>
            <div>GET /api/roles - Fetch roles list</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTest;
