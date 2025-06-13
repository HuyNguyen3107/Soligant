import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { selectMyAssignedOrders } from "../../redux/features/orderManagementSlice";
import Logo from "../ui/Logo";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myOrders = useSelector(selectMyAssignedOrders);
  const currentPath = location.pathname;

  // Debug log
  console.log("Current path:", currentPath);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API fails
      navigate("/admin/login", { replace: true });
    }
  };

  // Hàm kiểm tra xem một menu item có đang được active không
  const isItemActive = (itemPath) => {
    if (currentPath === itemPath) return true;
    if (currentPath.startsWith(itemPath + "/")) return true;
    // Trường hợp đặc biệt: nếu đang ở /admin và item là Dashboard
    if (currentPath === "/admin" && itemPath === "/admin/dashboard")
      return true;
    return false;
  };

  // Danh sách các menu items
  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
    },
    {
      title: "Đơn hàng",
      path: "/admin/orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Đơn hàng của tôi",
      path: "/admin/my-orders",
      badge: myOrders.length > 0 ? myOrders.length : null,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6z" />
          <path
            fillRule="evenodd"
            d="M3 18a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
          <path d="M13 10a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1z" />
          <path d="M9 12a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" />
        </svg>
      ),
    },
    {
      title: "Sản phẩm",
      path: "/admin/products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Kho hàng",
      path: "/admin/inventory",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Người dùng",
      path: "/admin/users",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      title: "Cài đặt",
      path: "/admin/settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];
  return (
    <div className="w-64 h-screen bg-soligant-primary text-white flex flex-col shadow-lg">
      <div className="p-5 border-b border-soligant-primary-light">
        <div className="flex items-center justify-between">
          <Logo
            variant="text"
            size="md"
            color="white"
            to="/"
            className="hover:opacity-80 transition-opacity"
          />
          <span className="text-xs text-gray-300 font-normal">ADMIN</span>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        <ul className="py-4">
          {" "}
          {menuItems.map((item, index) => (
            <li key={index}>
              {" "}
              <Link
                to={item.path}
                className={`flex items-center justify-between space-x-3 px-4 py-3 transition duration-150 ${
                  isItemActive(item.path)
                    ? "bg-soligant-primary-dark border-r-4 border-white font-bold shadow-inner"
                    : "hover:bg-soligant-primary-light"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-white">{item.icon}</div>
                  <span className="font-medium">{item.title}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>{" "}
      <div className="p-4 border-t border-soligant-primary-light">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-sm hover:text-gray-200 transition duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
