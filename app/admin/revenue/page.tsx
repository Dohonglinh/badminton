"use client";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Tag,
  Card,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { db } from "@/app/source/firebaseConfig";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

const { Title } = Typography;

interface Court {
  id: number;
  name: string;
  image: string;
  price: number;
  type: string;
  firestoreId?: string;
}

const AdminPage = () => {
  const toast = useRef<Toast>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [form] = Form.useForm();

  const fetchCourts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "courts"));
      const courtList = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Court;
        return {
          ...data,
          firestoreId: docSnap.id,
          image: data.image.startsWith("/public") ? data.image.replace("/public", "") : data.image,
        };
      });
      setCourts(courtList);
    } catch (error) {
      console.error("Error fetching courts:", error);
      message.error("Lấy dữ liệu sân thất bại!");
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const showModal = (court?: Court) => {
    if (court) {
      setEditingCourt(court);
      form.setFieldsValue(court);
    } else {
      setEditingCourt(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCourt(null);
    form.resetFields();
  };

 const handleSubmit = async (values: Court) => {
    try {
     const { firestoreId, ...courtData } = values;
      console.log("firestoreId:", firestoreId);

     const docId = String(courtData.id);

      await setDoc(doc(db, "courts", docId), courtData);

    toast.current?.show({
      severity: "success",
      summary: "Thành công",
      detail: editingCourt ? "Cập nhật sân thành công!" : "Thêm sân thành công!",
      life: 2000,
    });

    fetchCourts();
    handleCancel();
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
    toast.current?.show({
      severity: "error",
      summary: "Lỗi",
      detail: "Lưu dữ liệu thất bại.",
      life: 2000,
    });
  }
};

 const handleDelete = async (firestoreId?: string) => {
  if (!firestoreId) return;
  try {
    await deleteDoc(doc(db, "courts", firestoreId));
    toast.current?.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đã xóa sân thành công!",
      life: 2000,
    });
    fetchCourts();
  } catch (error) {
    console.error("Lỗi khi xóa sân:", error);
    toast.current?.show({
      severity: "error",
      summary: "Lỗi",
      detail: "Không thể xóa sân!",
      life: 1000,
    });
  }
};
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center" as const,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      align: "center" as const,
      render: (url: string) => (
    <div className="flex justify-center items-center">
      <Image
      src={url}
      alt="Sân"
      width={80}
      height={80}
      className="object-cover rounded-lg shadow-md"
      unoptimized
      />
    </div>
      ),
    },
    {
      title: "Tên sân",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
    },
    {
      title: "Giá thuê",
      dataIndex: "price",
      key: "price",
      align: "center" as const,
      render: (val: number) => (
        <span style={{ fontWeight: 500 }}>{val.toLocaleString()} đ</span>
      ),
    },
    {
      title: "Loại sân",
      dataIndex: "type",
      key: "type",
      align: "center" as const,
      render: (type: string) => (
        <Tag color="green" style={{ fontWeight: 500 }}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: unknown, record: Court) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            ✏️ Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.firestoreId)}>
            🗑️ Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
        <Toast ref={toast} />
    
    <Card
      style={{
        margin: 24,
        borderRadius: 12,
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
      // bodyStyle={{ padding: 24 }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
  <Col>
    <Title level={3} style={{ margin: 0, color: "#1890ff", fontWeight: 600 }}>
      🏸 Quản lý sân cầu lông
    </Title>
  </Col>
  <Col>
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => showModal()}
      style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
    >
      Thêm sân mới
    </Button>
  </Col>
</Row>

<Divider />


      
      <Table
        dataSource={courts}
        columns={columns}
        rowKey="firestoreId"
        bordered
        pagination={false}
        style={{ background: "#fff", borderRadius: 8 }}
      />

      <Modal
        open={isModalVisible}
        title={
          <span style={{ fontWeight: 600 }}>
            {editingCourt ? "🛠️ Cập nhật sân" : "➕ Thêm sân mới"}
          </span>
        }
        onCancel={handleCancel}
        footer={null}
        centered
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="id" label="ID" rules={[{ required: true, message: "Nhập ID!" }]}>
            <InputNumber style={{ width: "100%" }} placeholder="VD: 1" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Đường dẫn ảnh"
            rules={[{ required: true, message: "Nhập đường dẫn ảnh!" }]}
          >
            <Input placeholder="/images/san1.jpg" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên sân"
            rules={[{ required: true, message: "Nhập tên sân!" }]}
          >
            <Input placeholder="Sân số 1" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá thuê (VND)"
            rules={[{ required: true, message: "Nhập giá thuê!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} placeholder="50000" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại sân"
            rules={[{ required: true, message: "Nhập loại sân!" }]}
          >
            <Input placeholder="Đơn / Đôi" />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              {editingCourt ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }} ghost danger>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
    </>
  );
};

export default AdminPage;
