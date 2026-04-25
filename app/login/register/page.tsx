"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/app/source/firebaseConfig";
import Link from "next/link";
import Image from "next/image";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (error) {
      // FirebaseError có thuộc tính code, nhưng để an toàn kiểm tra kiểu dữ liệu
      if (typeof error === "object" && error && "code" in error) {
        const err = error as { code: string };
        if (err.code === "auth/email-already-in-use") {
          message.error("Email đã được sử dụng!");
        } else if (err.code === "auth/invalid-email") {
          message.error("Email không hợp lệ!");
        } else if (err.code === "auth/weak-password") {
          message.error("Mật khẩu phải có ít nhất 6 ký tự!");
        } else {
          message.error("Đã xảy ra lỗi khi đăng ký.");
        }
      } else {
        message.error("Đã xảy ra lỗi khi đăng ký.");
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
          <h2 className="text-xl font-bold mt-2">Đăng ký tài khoản Admin</h2>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
                message:
                  "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ thường, chữ hoa và ký tự đặc biệt!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
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
              ĐĂNG KÝ
            </Button>
          </Form.Item>

          <div className="text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Đăng nhập
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
