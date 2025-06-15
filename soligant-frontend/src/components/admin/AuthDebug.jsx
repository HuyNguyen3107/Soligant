// src/components/admin/AuthDebug.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "../../redux/features/authSlice";
import authAPI from "../../api/authAPI";
import { getSessionToken, getRefreshToken } from "../../utils/auth";

const AuthDebug = () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetTokens = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getRefreshTokens();
      setTokens(response);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await authAPI.logoutAll();
      dispatch(logout());
      alert("Đã logout tất cả devices");
    } catch (error) {
      console.error("Error logout all:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const currentTokens = {
    accessToken: getSessionToken(),
    refreshToken: getRefreshToken(),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Auth Debug Panel</h2>

      {/* Current User */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current User</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(currentUser, null, 2)}
        </pre>
      </div>

      {/* Current Tokens */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Tokens (Client)</h3>
        <div className="bg-gray-100 p-3 rounded text-sm">
          <div>
            <strong>Access Token:</strong>{" "}
            {currentTokens.accessToken
              ? `${currentTokens.accessToken.substring(0, 20)}...`
              : "None"}
          </div>
          <div>
            <strong>Refresh Token:</strong>{" "}
            {currentTokens.refreshToken
              ? `${currentTokens.refreshToken.substring(0, 20)}...`
              : "None"}
          </div>
        </div>
      </div>

      {/* Database Tokens */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Database Tokens</h3>
          <button
            onClick={handleGetTokens}
            disabled={loading}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        {tokens ? (
          <div className="bg-gray-100 p-3 rounded text-sm">
            <div>
              <strong>User ID:</strong> {tokens.user_id}
            </div>
            <div>
              <strong>Total Tokens:</strong> {tokens.tokens.length}
            </div>
            <div className="mt-2">
              {tokens.tokens.map((token, index) => (
                <div key={token.id} className="border-b border-gray-200 py-2">
                  <div>
                    <strong>#{index + 1}:</strong> {token.token}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        token.status === "active"
                          ? "bg-green-100 text-green-800"
                          : token.status === "expired"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {token.status}
                    </span>
                  </div>
                  <div>
                    <strong>Created:</strong>{" "}
                    {new Date(token.created_at).toLocaleString()}
                  </div>
                  <div>
                    <strong>Expires:</strong>{" "}
                    {new Date(token.expires_at).toLocaleString()}
                  </div>
                  {token.revoked_at && (
                    <div>
                      <strong>Revoked:</strong>{" "}
                      {new Date(token.revoked_at).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-3 rounded text-sm text-gray-500">
            Click "Refresh" to load database tokens
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleLogoutAll}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout All Devices
        </button>
        <button
          onClick={() => dispatch(logout())}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Logout Current
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
