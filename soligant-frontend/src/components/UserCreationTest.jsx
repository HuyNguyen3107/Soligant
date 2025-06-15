// UserCreationTest.jsx - Component test đơn giản cho tính năng tạo user
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  fetchUsers,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
} from "../redux/features/userSlice";
import { fetchRoles, selectRoles } from "../redux/features/roleSlice";

const UserCreationTest = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    roles: [],
    is_active: true,
  });

  const [testLog, setTestLog] = useState([]);

  // Log function
  const log = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    setTestLog((prev) => [...prev, { timestamp, message, type }]);
  };

  useEffect(() => {
    log("Component mounted, loading initial data");
    dispatch(fetchUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    log(`Users loaded: ${users.length} users`);
  }, [users]);

  useEffect(() => {
    log(`Roles loaded: ${roles.length} roles`);
  }, [roles]);

  useEffect(() => {
    if (error) {
      log(`Error occurred: ${error}`, "error");
    }
  }, [error]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    log(`Form field updated: ${field} = ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    log("Form submitted, starting user creation");
    log(`Form data: ${JSON.stringify(formData)}`);

    try {
      const result = await dispatch(createUser(formData)).unwrap();
      log("User created successfully", "success");
      log(`Created user: ${JSON.stringify(result)}`);

      // Reset form
      setFormData({
        email: "",
        password: "",
        full_name: "",
        phone: "",
        roles: [],
        is_active: true,
      });

      // Refresh users list
      dispatch(fetchUsers());
    } catch (error) {
      log(`User creation failed: ${error}`, "error");
    }
  };

  const clearLogs = () => {
    setTestLog([]);
  };

  const generateTestData = () => {
    const timestamp = Date.now();
    const testData = {
      email: `test${timestamp}@example.com`,
      password: "testpassword123",
      full_name: `Test User ${timestamp}`,
      phone: "0123456789",
      roles: roles.length > 0 ? [roles[0].name] : [],
      is_active: true,
    };
    setFormData(testData);
    log("Test data generated");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Creation Test</h1>

      {/* Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Users loaded: {users.length}</div>
          <div>Roles loaded: {roles.length}</div>
          <div>Loading: {loading ? "Yes" : "No"}</div>
          <div>Error: {error || "None"}</div>
        </div>
      </div>

      {/* Form */}
      <div className="mb-6">
        <h2 className="font-semibold mb-4">Create User Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Roles</label>
            <select
              multiple
              value={formData.roles}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                handleInputChange("roles", selected);
              }}
              className="w-full px-3 py-2 border rounded"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleInputChange("is_active", e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm font-medium">Active</label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
            <button
              type="button"
              onClick={generateTestData}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Generate Test Data
            </button>
          </div>
        </form>
      </div>

      {/* Logs */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Test Logs</h2>
          <button
            onClick={clearLogs}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded"
          >
            Clear Logs
          </button>
        </div>
        <div className="bg-black text-green-400 p-4 rounded max-h-96 overflow-y-auto font-mono text-sm">
          {testLog.length === 0 ? (
            <div>No logs yet...</div>
          ) : (
            testLog.map((log, index) => (
              <div
                key={index}
                className={`
                ${log.type === "error" ? "text-red-400" : ""}
                ${log.type === "success" ? "text-green-400" : ""}
                ${log.type === "info" ? "text-blue-400" : ""}
              `}
              >
                [{log.timestamp}] {log.type.toUpperCase()}: {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCreationTest;
