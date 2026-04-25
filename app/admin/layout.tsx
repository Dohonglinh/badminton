"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin, Menu } from "antd";
import {
  DashboardOutlined,
  FieldTimeOutlined,
  BarChartOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export function SideBar({
  onNavigate,
  visible,
  onClose,
}: {
  onNavigate: (key: string) => void;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`
        fixed z-40 top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300
        ${visible ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:block
      `}
      style={{ width: 220, minWidth: 220, maxWidth: 220 }}
    >
      <div className="flex flex-col items-center py-6 bg-white relative">
        <img src="/images/logo.png" alt="Logo" className="size-full px-8" />
        {/* Nút đóng sidebar trên mobile */}
        <button
          className="absolute top-2 right-2 md:hidden"
          onClick={onClose}
          aria-label="Đóng menu"
        >
          <CloseOutlined />
        </button>
      </div>
      <Menu
        className="custom-menu"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        style={{ height: "100%" }}
        onClick={({ key }) => {
          onNavigate(key.toString());
          onClose(); // Đóng sidebar khi chọn menu trên mobile
        }}
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
          {
            key: "order",
            icon: <FieldTimeOutlined />,
            label: "Quản lý người dùng",
          },
          {
            key: "revenue",
            icon: <BarChartOutlined />,
            label: "Cập nhật dữ liệu",
          },
        ]}
      />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (key: string) => {
    startTransition(() => {
      router.push(`/admin/${key}`);
    });
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-70 flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}

      {/* Nút mở sidebar trên mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-full shadow p-2"
        onClick={() => setSidebarOpen(true)}
        aria-label="Mở menu"
      >
        <MenuOutlined className="text-xl" />
      </button>

      <div className="flex h-screen flex-row md:overflow-hidden">
        {/* Sidebar responsive */}
        <SideBar
          onNavigate={handleNavigate}
          visible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {/* Nội dung chính */}
        <div className="flex-grow p-6">{children}</div>
      </div>
    </>
  );
}
