"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/app/source/firebaseConfig";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const auth = getAuth(app);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("Đăng nhập thành công");
      router.push("/admin/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        message.error("Sai email hoặc mật khẩu!");
      } else {
        message.error("Đã xảy ra lỗi không xác định!");
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
        {/* HoGo Logo and Title */}
        <div className="flex flex-col items-center py-6 bg-white">
          <img src="/images/logo.png" alt="Logo" className="size-full px-8" />
        </div>

        <Form
          form={form}
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập email của bạn"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu của bạn"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="bg-orange-500 hover:bg-orange-600 border-orange-500 uppercase font-bold"
            >
              LOGIN
            </Button>
          </Form.Item>

          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <Link href="/login/forgot-password" className="hover:text-gray-700">
              Quên mật khẩu?
            </Link>
            <Link href="/login/register" className="hover:text-gray-700">
              Đăng ký tài khoản
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;