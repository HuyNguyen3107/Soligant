// src/utils/cleanup.util.js
const { RefreshToken } = require("../models");
const { Op } = require("sequelize");

/**
 * Cleanup expired refresh tokens
 */
const cleanupExpiredTokens = async () => {
  try {
    const result = await RefreshToken.destroy({
      where: {
        [Op.or]: [
          { expires_at: { [Op.lt]: new Date() } }, // Expired tokens
          { revoked_at: { [Op.not]: null } }, // Revoked tokens older than 7 days
        ],
      },
    });

    console.log(`Cleaned up ${result} expired/revoked refresh tokens`);
    return result;
  } catch (error) {
    console.error("Error cleaning up tokens:", error);
    throw error;
  }
};

/**
 * Cleanup old audit logs (older than 90 days)
 */
const cleanupOldAuditLogs = async () => {
  try {
    const { AuditLog } = require("../models");
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    const result = await AuditLog.destroy({
      where: {
        created_at: { [Op.lt]: cutoffDate },
      },
    });

    console.log(`Cleaned up ${result} old audit logs`);
    return result;
  } catch (error) {
    console.error("Error cleaning up audit logs:", error);
    throw error;
  }
};

module.exports = {
  cleanupExpiredTokens,
  cleanupOldAuditLogs,
};
