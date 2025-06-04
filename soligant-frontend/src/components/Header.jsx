import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-soligant-primary text-white z-50 shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="font-rafgins text-2xl md:text-3xl m-0 text-white">
            SOLIGANT
          </h1>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
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
            to="/order/track"
            className="hover:text-soligant-secondary transition-colors"
          >
            Theo dõi đơn hàng
          </Link>
          <Link
            to="/admin/login"
            className="hover:text-soligant-secondary transition-colors"
          >
            Đăng nhập
          </Link>
        </nav>

        {/* Menu Mobile Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

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
              to="/order/track"
              className="hover:text-soligant-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Theo dõi đơn hàng
            </Link>
            <Link
              to="/admin/login"
              className="hover:text-soligant-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Đăng nhập
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
