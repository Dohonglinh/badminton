"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/app/source/firebaseConfig";
import Link from "next/link";
import Image from "next/image";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const auth = getAuth(app);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      message.success("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!");
      router.push("/login");
    } catch (error) {
      if (typeof error === "object" && error && "code" in error) {
        const err = error as { code: string };
        if (err.code === "auth/user-not-found") {
          message.error("Email này chưa được đăng ký!");
        } else if (err.code === "auth/invalid-email") {
          message.error("Email không hợp lệ!");
        } else {
          message.error("Đã xảy ra lỗi khi gửi email.");
        }
      } else {
        message.error("Đã xảy ra lỗi khi gửi email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center w-screen h-screen bg-center bg-cover bg-gray-50"
      style={{ backgroundImage: "url('/images/bg123.jpg')" }}
    >
      <Card
        variant="borderless"
        className="w-full max-w-3xl bg-white shadow-md rounded-xl"
      >
        <div className="flex flex-col items-center py-6 bg-white">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={800}
            height={400}
            className="px-8 object-contain"
            priority
          />
          <h2 className="text-xl font-bold mt-2">Quên mật khẩu</h2>
        </div>

        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email đã đăng ký"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-blue-600 hover:bg-blue-700 uppercase font-bold"
              size="large"
            >
              GỬI YÊU CẦU
            </Button>
          </Form.Item>

          <div className="text-center text-sm text-gray-600">
            Đã nhớ mật khẩu?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Đăng nhập
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;