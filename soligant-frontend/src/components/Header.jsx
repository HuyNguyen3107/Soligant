import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/authSlice";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-soligant-primary text-white z-50 shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="font-rafgins text-2xl md:text-3xl m-0 text-white">
            SOLIGANT
          </h1>
        </Link>{" "}
        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link
            to="/"
            className="hover:text-soligant-secondary transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            to="/collections"
            className="hover:text-soligant-secondary transition-colors"
          >
            Bộ sưu tập
          </Link>
          <Link
            to="/order-search"
            className="hover:text-soligant-secondary transition-colors"
          >
            Tìm đơn hàng
          </Link>
          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 hover:text-soligant-secondary transition-colors focus:outline-none"
              >
                <FaUser className="text-sm" />
                <span>{user?.username || "Admin"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">
                      {user?.username || "Admin"}
                    </div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>

                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FaCog className="mr-2" />
                    Trang quản trị
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="hover:text-soligant-secondary transition-colors"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
        {/* Menu Mobile Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>{" "}
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-soligant-primary">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              to="/"
              className="hover:text-soligant-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/collections"
              className="hover:text-soligant-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bộ sưu tập
            </Link>
            <Link
              to="/order-search"
              className="hover:text-soligant-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tìm đơn hàng
            </Link>

            {/* Auth Section Mobile */}
            {isAuthenticated ? (
              <div className="border-t border-soligant-primary-light pt-4 mt-4">
                <div className="flex items-center space-x-2 mb-3 text-soligant-secondary">
                  <FaUser className="text-sm" />
                  <span className="font-medium">
                    {user?.username || "Admin"}
                  </span>
                </div>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-2 hover:text-soligant-secondary transition-colors mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCog className="text-sm" />
                  <span>Trang quản trị</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 hover:text-soligant-secondary transition-colors"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="hover:text-soligant-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
