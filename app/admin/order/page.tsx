"use client";

import { db } from "@/app/source/firebaseConfig";
import SearchForm from "@/app/admin/order/components/search";
import TableScroll from "@/app/admin/order/components/table";
import { Modal, Select, Input, DatePicker, message, Form } from "antd";
import dayjs from "dayjs";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";
import { DURATION_OPTIONS } from "@/app/constant/constant";
import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { CheckCircleOutlined, DollarOutlined } from "@ant-design/icons";
import { FormDataType, CourtType } from "@/app/data/types"; // Import the FormDataType interface
import { getColumns } from "@/app/data/data"; // Import the getColumns function
import Title from "./components/title";
// ...existing code...
import "./style.css";

//

export default function Page() {
  const toast = useRef<Toast>(null);
  const handlePaymentStatus = async (record: FormDataType) => {
    try {
      if (!record.key) {
        throw new Error("Record key is missing");
      }

      const bookingRef = doc(db, "bookings", record.key);
      await updateDoc(bookingRef, {
        isPaid: true,
        paidAt: serverTimestamp(),
      });

      toast.current?.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đặt sân thành công!",
        life: 3000,
      });

      // Update local state
      const updatedBookings = bookings.map((booking) =>
        booking.key === record.key ? { ...booking, isPaid: true } : booking
      );

      setBookings(updatedBookings);
setFilteredBookings(
  updatedBookings.filter((booking) => {
    // Apply current filters
    const nameMatch = searchName
      ? booking.fullName.toLowerCase().includes(searchName.toLowerCase())
      : true;
    const phoneMatch = searchPhone
      ? booking.phone.includes(searchPhone)
      : true;
    const courtMatch = searchCourt
      ? Number(booking.courtId) === Number(searchCourt) ||
        (booking.courtName && booking.courtName.includes(searchCourt))
      : true;
    const paymentMatch = searchPaymentStatus
      ? searchPaymentStatus === "paid"
        ? booking.isPaid
        : !booking.isPaid
      : true;

    return nameMatch && phoneMatch && courtMatch && paymentMatch;
  })
);

      // Update revenue stats
      calculateRevenueStats(updatedBookings);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái thanh toán");
    }
  };
  const handleDelete = async (record: FormDataType) => {
    try {
      if (!record.key) {
        throw new Error("Record key is missing");
      }

      console.log("Xóa đơn đặt sân với ID:", record.key);

      const docRef = doc(db, "bookings", record.key);

      await deleteDoc(docRef);

      toast.current?.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã xóa đơn đặt sân thành công!",
        life: 1000,
      });

      // Cập nhật state sau khi xóa
      const updatedBookings = bookings.filter(
        (booking) => booking.key !== record.key
      );
      setBookings(updatedBookings);
      setFilteredBookings(
        filteredBookings.filter((booking) => booking.key !== record.key)
      );

      // Cập nhật thống kê
      calculateRevenueStats(updatedBookings);
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Có lỗi xảy ra khi xóa dữ liệu!",
        life: 2000,
      });
    }
  };
  const columns = getColumns(handlePaymentStatus, handleDelete);

  const [bookings, setBookings] = useState<FormDataType[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<FormDataType[]>([]);
  const [courtsData, setCourtsData] = useState<CourtType[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    paidCount: 0,
  });
  const [searchForm] = Form.useForm();
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchCourt, setSearchCourt] = useState("");
  const [searchPaymentStatus, setSearchPaymentStatus] = useState("");
  const [isComposing] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormDataType>({
    courtId: 0,
    courtName: "",
    fullName: "",
    phone: "",
    email: "",
    date: null,
    startTime: "",
    duration: "",
    endTime: "",
    totalPrice: 0,
    // timestamp: null,
    isPaid: false,
  });

  // Search form states

  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
        isPaid: doc.data().isPaid || false,
      })) as FormDataType[];

      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      calculateRevenueStats(bookingsData);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu bookings:", error);
    }
  };

  // Calculate revenue statistics
  const calculateRevenueStats = (bookingsData: FormDataType[]) => {
    const paidBookings = bookingsData.filter((booking) => booking.isPaid);
    const totalRevenue = paidBookings.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );

    setRevenueStats({
      totalRevenue,
      paidCount: paidBookings.length,
    });
  };

  // Handle payment status change

useEffect(() => {
  const fetchCourts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "courts"));
      const courtsList = snapshot.docs.map((doc) => ({
        id: Number(doc.id), // hoặc giữ nguyên nếu id là số
        ...doc.data(),
      })) as CourtType[];
      setCourtsData(courtsList);
    } catch (error) {
      console.error("Lỗi lấy danh sách sân:", error);
    }
  };

  fetchCourts();
}, []);

  // Handle search

  const resetSearch = () => {
    searchForm.resetFields();
    setSearchName("");
    setSearchPhone("");
    setSearchCourt("");
    setSearchPaymentStatus("");
    setFilteredBookings(bookings);
  };

  // Handle input change
  const handleChange = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isComposing) {
      setFormData({ ...formData, fullName: e.target.value });
    }
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: e.target.value });
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const generateTimeSlots = () => {
    const slots = [];
    let start = dayjs().hour(5).minute(0); // 05:00
    const end = dayjs().hour(21).minute(0); // 21:00

    while (start.isBefore(end) || start.isSame(end)) {
      const timeStr = start.format("HH:mm");
      slots.push({
        label: timeStr,
        value: timeStr,
      });
      start = start.add(30, "minute");
    }
    return slots;
  };

  const calculateEndTime = () => {
    if (!formData.startTime || !formData.duration) return "";
    // Map giá trị duration sang số phút
    const durationMap: { [key: string]: number } = {
      "0.5": 30,
      "1": 60,
      "2": 120,
      "3": 180,
      "30m": 30,
      "1h": 60,
      "2h": 120,
      "3h": 180,
    };
    const durationInMinutes = durationMap[formData.duration] || 60;
    const start = dayjs(formData.startTime, "HH:mm");
    const end = start.add(durationInMinutes, "minute");
    return end.format("HH:mm");
  };

const handleCourtChange = (courtId: number) => {
  const selectedCourt = courtsData.find((court) => court.id === courtId);
  setFormData({
    ...formData,
    courtId,
    courtName: selectedCourt?.name || "",
  });
};


  const handleSubmit = async () => {
    // Validate form data
    const newError: { [key: string]: string } = {};

    if (!formData.fullName)
      newError.fullName = "Họ và tên không được để trống!";
    if (!formData.phone) newError.phone = "Số điện thoại không được để trống!";
    if (!formData.email) newError.email = "Email không được để trống!";
    if (!formData.date) newError.date = "Ngày không được để trống!";
    if (!formData.startTime)
      newError.startTime = "Giờ bắt đầu không được để trống!";
    if (!formData.duration)
      newError.duration = "Thời gian không được để trống!";
    if (!formData.courtId) newError.courtId = "Vui lòng chọn sân!";

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    const endTime = calculateEndTime();

    // Lấy giá sân theo courtId
    const selectedCourt = courtsData.find(
      (court) => String(court.id) === String(formData.courtId)
    );
    const courtPrice = selectedCourt ? selectedCourt.price : 0;

    // Map value sang số giờ
    const durationMap: { [key: string]: number } = {
      "30m": 0.5,
      "1h": 1,
      "2h": 2,
      "3h": 3,
    };
    const durationInHours = durationMap[formData.duration] || 1;
    const totalPrice = durationInHours * courtPrice;

  const newBooking = {
  ...formData,
  courtId: formData.courtId, // giữ là number
  endTime,
  totalPrice,
  date: formData.date
    ? typeof formData.date !== "string"
      ? formData.date.format("DD/MM/YYYY")
      : formData.date
    : "",
  timestamp: serverTimestamp(),
  isPaid: false,
};

    try {
      await addDoc(collection(db, "bookings"), newBooking);
      toast.current?.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đặt sân thành công!",
        life: 1000,
      });
      setIsOpenModal(false);
      setFormData({
        courtId: 0,
        courtName: "",
        fullName: "",
        phone: "",
        email: "",
        date: null,
        startTime: "",
        duration: "",
        endTime: "",
        totalPrice: 0,
        isPaid: false,
      });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi khi đặt sân:", err);
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Có lỗi xảy ra khi đặt sân!",
        life: 1000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div
        className="h-full overflow-auto pb-10"
        style={{ maxHeight: "calc(100vh - 64px)" }}
      >
        <Title onOpenModal={() => setIsOpenModal(true)} />
        {/* Thống kê doanh thu */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <DollarOutlined className="text-xl sm:text-2xl text-green-500 mr-2" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold">
                  Tổng doanh thu
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {revenueStats.totalRevenue.toLocaleString()} VND
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircleOutlined className="text-xl sm:text-2xl text-blue-500 mr-2" />
              <div>
                <h3 className="text-base sm:text-lg font-semibold">
                  Đặt sân đã thanh toán
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {revenueStats.paidCount} / {bookings.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <SearchForm
          form={searchForm}
          onSearch={(values) => {
            setSearchName(values.name || "");
            setSearchPhone(values.phone || "");
            setSearchCourt(values.courtId || "");
            setSearchPaymentStatus(values.paymentStatus || "");

            const filtered = bookings.filter((booking) => {
              const nameMatch = values.name
                ? booking.fullName
                    .toLowerCase()
                    .includes(values.name.toLowerCase())
                : true;

              const phoneMatch = values.phone
                ? booking.phone.includes(values.phone)
                : true;

              const courtMatch =
                values.courtId != null
                  ? Number(booking.courtId) === Number(values.courtId)
                  : true;

              const paymentMatch = values.paymentStatus
                ? values.paymentStatus === "paid"
                  ? booking.isPaid
                  : !booking.isPaid
                : true;

              return nameMatch && phoneMatch && courtMatch && paymentMatch;
            });

            setFilteredBookings(filtered);
          }}
          onReset={resetSearch}
          courtsData={courtsData}
        />

        {/* Bảng với thanh cuộn cải tiến */}
        <TableScroll
          columns={columns}
          dataSource={filteredBookings}
          resetSearch={resetSearch}
          searchCourt={searchCourt}
          searchPaymentStatus={searchPaymentStatus}
        />
        <Modal
          open={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          onOk={handleSubmit}
          title="Đặt sân"
          width={600}
          maskClosable={false}
          className="w-full max-w-lg sm:max-w-xl md:max-w-2xl"
        >
          <div className="p-2 md:p-4">
            <div className="w-full space-y-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Chọn Sân
                </label>
                <Select
  showSearch
  placeholder="Chọn sân"
  optionFilterProp="children"
  onChange={handleCourtChange} // vẫn dùng hàm trên
  filterOption={(input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
  }
  options={courtsData.map((court) => ({
    value: String(court.id), // Select cần value là string
    label: court.name,
  }))}
/>

                {error.courtId && (
                  <p className="text-red-500 text-sm">{error.courtId}</p>
                )}
                {formData.courtName && (
                  <p className="mt-2 font-bold text-blue-600">
                    {formData.courtName}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Họ và Tên
                  </label>
                  <Input
                    placeholder="Họ và tên"
                    size="large"
                    value={formData.fullName}
                    onChange={handleChangeName}
                    className="w-full"
                  />
                  {error.fullName && (
                    <p className="text-red-500 text-sm">{error.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Số Điện Thoại
                  </label>
                  <Input
                    placeholder="Số điện thoại"
                    size="large"
                    value={formData.phone}
                    onChange={handleChangePhone}
                    maxLength={10}
                    className="w-full"
                  />
                  {error.phone && (
                    <p className="text-red-500 text-sm">{error.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <Input
                    placeholder="Email"
                    size="large"
                    value={formData.email}
                    onChange={handleChangeEmail}
                    className="w-full"
                  />
                  {error.email && (
                    <p className="text-red-500 text-sm">{error.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Chọn Ngày
                  </label>
                  <DatePicker
                    className="w-full"
                    value={formData.date}
                    onChange={(date) => handleChange("date", date)}
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                      current && current.isBefore(dayjs(), "day")
                    }
                  />
                  {error.date && (
                    <p className="text-red-500 text-sm">{error.date}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Thời Gian Bắt Đầu
                    </label>
                    <Select
                      className="w-full"
                      options={generateTimeSlots()}
                      value={formData.startTime}
                      onChange={(value) => handleChange("startTime", value)}
                    />
                    {error.startTime && (
                      <p className="text-red-500 text-sm">{error.startTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Thời Lượng
                    </label>
                    <Select
                      className="w-full"
                      options={DURATION_OPTIONS}
                      value={formData.duration}
                      onChange={(value) => handleChange("duration", value)}
                    />
                    {error.duration && (
                      <p className="text-red-500 text-sm">{error.duration}</p>
                    )}
                    {formData.startTime && formData.duration && (
                      <p className="mt-2 text-gray-700 text-sm">
                        Giờ kết thúc: {calculateEndTime()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}