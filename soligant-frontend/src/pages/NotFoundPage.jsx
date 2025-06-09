import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-utm-avo text-soligant-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-6">Trang không tìm thấy</h2>
      <p className="mb-8 max-w-md">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link to="/" className="btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
