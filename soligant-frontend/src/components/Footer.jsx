import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-soligant-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo và thông tin */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <h2 className="font-rafgins text-3xl text-white m-0">SOLIGANT</h2>
            </Link>
            <p className="text-sm mb-4">
              Thương hiệu quà tặng tinh tế cho mọi dịp
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-soligant-secondary"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-soligant-secondary"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-white font-utm-avo">
              Liên kết
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-soligant-secondary transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  className="hover:text-soligant-secondary transition-colors"
                >
                  Bộ sưu tập
                </Link>
              </li>
              <li>
                <Link
                  to="/order/track"
                  className="hover:text-soligant-secondary transition-colors"
                >
                  Theo dõi đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="font-bold text-xl font-utm-avo mb-4 text-white">
              Liên hệ
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                <span>098 765 4321</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>contact@soligant.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Soligant. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
