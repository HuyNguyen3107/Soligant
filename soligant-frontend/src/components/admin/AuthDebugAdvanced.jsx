// src/components/admin/AuthDebugAdvanced.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthChecked,
  initializeAuth,
  login,
  logout,
} from "../../redux/features/authSlice";
import {
  getSessionToken,
  getRefreshToken,
  isAuthenticated as checkTokenExists,
} from "../../utils/auth";

const AuthDebugAdvanced = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const authChecked = useSelector(selectAuthChecked);

  const [debugInfo, setDebugInfo] = useState({});
  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        localStorage: {
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken"),
        },
        cookies: {
          sessionToken: document.cookie.includes("session_token"),
          refreshToken: document.cookie.includes("refresh_token"),
        },
        utils: {
          getSessionToken: getSessionToken(),
          getRefreshToken: getRefreshToken(),
          isAuthenticated: checkTokenExists(),
        },
        redux: {
          currentUser: currentUser
            ? `${currentUser.full_name} (${currentUser.email})`
            : "null",
          isAuthenticated,
          authLoading,
          authError,
          authChecked,
        },
        timestamp: new Date().toLocaleTimeString(),
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [currentUser, isAuthenticated, authLoading, authError, authChecked]);

  const handleInitializeAuth = () => {
    dispatch(initializeAuth());
  };

  const handleTestLogin = () => {
    dispatch(login({ username: "admin@soligant.com", password: "admin123" }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-yellow-400">
        🔍 Auth Debug Advanced
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* localStorage */}
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="font-semibold text-blue-400 mb-2">localStorage</h4>
          <div className="text-sm space-y-1">
            <div>
              accessToken:{" "}
              {debugInfo.localStorage?.accessToken ? "Present" : "Missing"}
            </div>
            <div>
              refreshToken:{" "}
              {debugInfo.localStorage?.refreshToken ? "Present" : "Missing"}
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="font-semibold text-yellow-400 mb-2">Cookies</h4>
          <div className="text-sm space-y-1">
            <div>
              session_token:{" "}
              {debugInfo.cookies?.sessionToken ? "Present" : "Missing"}
            </div>
            <div>
              refresh_token:{" "}
              {debugInfo.cookies?.refreshToken ? "Present" : "Missing"}
            </div>
          </div>
        </div>

        {/* Auth Utils */}
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="font-semibold text-green-400 mb-2">Auth Utils</h4>
          <div className="text-sm space-y-1">
            <div>
              getSessionToken:{" "}
              {debugInfo.utils?.getSessionToken ? "Present" : "Missing"}
            </div>
            <div>
              getRefreshToken:{" "}
              {debugInfo.utils?.getRefreshToken ? "Present" : "Missing"}
            </div>
            <div>
              isAuthenticated:{" "}
              {debugInfo.utils?.isAuthenticated ? "true" : "false"}
            </div>
          </div>
        </div>

        {/* Redux State */}
        <div className="bg-gray-700 p-3 rounded md:col-span-3">
          <h4 className="font-semibold text-purple-400 mb-2">Redux State</h4>
          <div className="text-sm space-y-1">
            <div>currentUser: {debugInfo.redux?.currentUser}</div>
            <div>
              isAuthenticated:{" "}
              {debugInfo.redux?.isAuthenticated ? "true" : "false"}
            </div>
            <div>
              authLoading: {debugInfo.redux?.authLoading ? "true" : "false"}
            </div>
            <div>authError: {debugInfo.redux?.authError || "null"}</div>
            <div>
              authChecked: {debugInfo.redux?.authChecked ? "true" : "false"}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleInitializeAuth}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Initialize Auth
        </button>
        <button
          onClick={handleTestLogin}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
        >
          Test Login
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Logout
        </button>
        <button
          onClick={clearTokens}
          className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
        >
          Clear Tokens
        </button>
      </div>

      {/* Status */}
      <div className="text-xs text-gray-400">
        Last updated: {debugInfo.timestamp}
      </div>
    </div>
  );
};

export default AuthDebugAdvanced;
