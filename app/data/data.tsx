import { Button, Popconfirm, Tag } from "antd";
import { CheckCircleOutlined, DollarOutlined, DeleteOutlined } from "@ant-design/icons";
import { FormDataType } from "./types"; // Import interface FormDataType
import dayjs from "dayjs"; // Đảm bảo bạn đã import dayjs

// Hàm helper để format ngày tháng với định dạng tùy chỉnh
const formatDate = (date: string | dayjs.Dayjs | null | undefined, format: string = "DD/MM/YYYY"): string => {
  if (!date) return "";
  // if (typeof date === "string") return date;
  return dayjs(date).format(format);
};

// Các hàm xử lý sẽ được truyền từ component cha qua props
export const getColumns = (
  handlePaymentStatus: (record: FormDataType) => void,
  handleDelete: (record: FormDataType) => void
) => [
  {
    title: "Loại đặt",
    key: "bookingType",
    width: 100,
    className: "text-xs",
    render: (_: unknown, record: FormDataType) => (
      <Tag color={record.isMonthly ? "blue" : "green"}>
        {record.isMonthly ? "Theo tháng" : "Đặt lẻ"}
      </Tag>
    ),
  },
  {
    title: "Họ Tên",
    dataIndex: "fullName",
    key: "fullName",
    width: 120,
    ellipsis: true,
    className: "text-xs",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    width: 90,
    className: "text-xs",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 130,
    ellipsis: true,
    className: "text-xs",
  },
  {
    title: "Sân",
    dataIndex: "courtName",
    key: "courtName",
    width: 80,
    ellipsis: true,
    className: "text-xs",
  },
   {
    title: "Ngày Đặt Sân",
    key: "date",
    width: 100,
    className: "text-xs",
    render: (_: unknown, record: FormDataType) => (
      <span>
        {record.isMonthly ? (
          `${formatDate(record.monthlyStartDate, "DD/MM/YYYY")} - ${formatDate(record.monthlyEndDate, "DD/MM/YYYY")}`
        ) : (
          formatDate(record.date, "DD/MM/YYYY")
        )}
      </span>
    ),
  },
  {
    title: "Khung giờ",
    key: "timeRange",
    width: 110,
    className: "text-xs",
    render: (_: unknown, record: FormDataType) => (
      <span>
        {record.startTime} - {record.endTime}
      </span>
    ),
  },
  {
    title: "Thời lượng",
    key: "duration",
    width: 70,
    className: "text-xs",
    render: (_: unknown, record: FormDataType) => (
      <span>
        {record.isMonthly ? (
          `${record.hoursPerSession}h/ngày`
        ) : (
          `${record.duration}`
        )}
      </span>
    ),
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalPrice",
    key: "totalPrice",
    width: 100,
    className: "text-xs",
    render: (total: number) => `${total?.toLocaleString()} VND`,
  },
  {
    title: "Trạng thái",
    key: "status",
    width: 100,
    className: "text-xs",
    render: (_: unknown, record: FormDataType) => (
      record.isPaid ? (
        <Button
          type="text"
          icon={<CheckCircleOutlined />}
          className="text-green-500"
        >
          Đã thanh toán
        </Button>
      ) : (
        <Popconfirm
          title="Xác nhận thanh toán?"
          onConfirm={() => handlePaymentStatus(record)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            icon={<DollarOutlined />}
          >
            Thanh toán
          </Button>
        </Popconfirm>
      )
    ),
  },
  {
    title: "Thao tác",
    key: "action",
    width: 80,
    className: "text-xs",
    render: (_: unknown, record: FormDataType) => (
      <Popconfirm
        title="Xác nhận xóa?"
        onConfirm={() => handleDelete(record)}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          className="text-red-500"
        >
          Xóa
        </Button>
      </Popconfirm>
    ),
  },
];