/**
 * Lấy ngày giờ hiện tại theo định dạng UTC (YYYY-MM-DD HH:MM:SS)
 * @returns string format: 2025-05-31 02:39:25
 */
const getCurrentUTCDateTime = () => {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {
  getCurrentUTCDateTime,
};
