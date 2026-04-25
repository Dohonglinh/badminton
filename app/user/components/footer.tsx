import { Layout } from "antd";

const { Footer } = Layout;

export default function CustomFooter() {
  return (
    <Footer className="bg-gray-900 text-white text-center p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">🏸 Badminton Booking</h2>
          <p className="text-sm text-gray-400">Đặt sân dễ dàng & nhanh chóng</p>
        </div>

        {/* Menu */}
        <div className="mb-4 md:mb-0">
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-gray-400">Trang chủ</a></li>
            <li><a href="#" className="hover:text-gray-400">Sân cầu lông</a></li>
            <li><a href="#" className="hover:text-gray-400">Liên hệ</a></li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <p className="text-sm">📍 Địa chỉ: Hà Nội, Việt Nam</p>
          <p className="text-sm">📞 Hotline: 0123 456 789</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Badminton Booking. All rights reserved.
      </div>
    </Footer>
  );
}
