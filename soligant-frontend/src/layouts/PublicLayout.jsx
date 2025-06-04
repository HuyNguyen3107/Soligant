import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-[68px]">
        {" "}
        {/* Thêm padding-top tương đương với chiều cao của header */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
