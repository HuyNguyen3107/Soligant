// src/components/test/TokenDebug.jsx
import React, { useState, useEffect } from "react";
import {
  getSessionToken,
  getRefreshToken,
  isAuthenticated,
} from "../../utils/auth";
import { useSelector } from "react-redux";

const TokenDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const authState = useSelector((state) => state.auth);

  const refreshDebugInfo = () => {
    const allCookies = document.cookie;
    const sessionToken = getSessionToken();
    const refreshToken = getRefreshToken();
    const isAuth = isAuthenticated();

    setDebugInfo({
      allCookies,
      sessionToken,
      refreshToken,
      isAuth,
      reduxAuth: authState,
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    refreshDebugInfo();
  }, [authState]);

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded shadow-lg max-w-md z-50">
      <h3 className="font-bold text-yellow-400 mb-2">🔍 Token Debug</h3>
      <button
        onClick={refreshDebugInfo}
        className="mb-2 px-2 py-1 bg-blue-600 text-white rounded text-xs"
      >
        Refresh
      </button>

      <div className="text-xs space-y-2">
        <div>
          <strong>All Cookies:</strong>
          <div className="bg-gray-800 p-1 rounded text-xs break-all">
            {debugInfo.allCookies || "None"}
          </div>
        </div>

        <div>
          <strong>Session Token:</strong>
          <div className="bg-gray-800 p-1 rounded text-xs break-all">
            {debugInfo.sessionToken || "None"}
          </div>
        </div>

        <div>
          <strong>Refresh Token:</strong>
          <div className="bg-gray-800 p-1 rounded text-xs break-all">
            {debugInfo.refreshToken || "None"}
          </div>
        </div>

        <div>
          <strong>isAuthenticated:</strong>{" "}
          {debugInfo.isAuth ? "true" : "false"}
        </div>

        <div>
          <strong>Redux Auth:</strong>
          <div className="bg-gray-800 p-1 rounded text-xs">
            isAuthenticated:{" "}
            {debugInfo.reduxAuth?.isAuthenticated ? "true" : "false"}
            <br />
            authChecked: {debugInfo.reduxAuth?.authChecked ? "true" : "false"}
            <br />
            loading: {debugInfo.reduxAuth?.loading ? "true" : "false"}
            <br />
            user: {debugInfo.reduxAuth?.user?.email || "null"}
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Last updated: {debugInfo.timestamp}
        </div>
      </div>
    </div>
  );
};

export default TokenDebug;
