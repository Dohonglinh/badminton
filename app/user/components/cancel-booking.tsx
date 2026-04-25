"use client";
import { useState } from 'react';
import { Modal, Space, Typography, Input, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/source/firebaseConfig';
import dayjs from 'dayjs';

interface BookingInfo {
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  fullName: string;
  email: string;
  isPaid?: boolean;
}

const { Title, Text } = Typography;

export default function CancelBooking() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);

  const handleCancel = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra mã đặt sân
      const bookingRef = doc(db, "bookings", bookingCode);
      const bookingSnap = await getDoc(bookingRef);

      if (!bookingSnap.exists()) {
        message.error("Không tìm thấy thông tin đặt sân với mã này!");
        return;
      }

      const bookingData = bookingSnap.data() as BookingInfo;
      
      // Cập nhật bookingInfo để hiển thị thông tin
      setBookingInfo({
        courtName: bookingData.courtName,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        fullName: bookingData.fullName,
        email: bookingData.email,
        isPaid: bookingData.isPaid
      });

      // Kiểm tra thời gian đã qua
      const [bookingYear, bookingMonth, bookingDay] = bookingData.date.split('-').map(Number);
      const [bookingHour, bookingMinute] = bookingData.startTime.split(':').map(Number);

      const bookingDateTime = dayjs()
        .year(bookingYear)
        .month(bookingMonth - 1) // dayjs months are 0-based
        .date(bookingDay)
        .hour(bookingHour)
        .minute(bookingMinute)
        .second(0);

      const now = dayjs();

      if (bookingDateTime.isBefore(now)) {
        message.error("Không thể hủy đặt sân cho thời gian đã qua!");
        return;
      }

      // Kiểm tra thời gian hủy sân (chỉ cho phép hủy trước 2 tiếng)
      const minutesDiff = bookingDateTime.diff(now, 'minute');
      const hoursDiff = minutesDiff / 60;

      if (hoursDiff < 2) {
        const remainingMinutes = Math.max(0, minutesDiff);
        let errorMsg = "❌ Không thể hủy sân! ";
        
        if (remainingMinutes <= 0) {
          errorMsg += "Đã quá thời gian đặt sân.";
        } else {
          errorMsg += `Thời gian đặt sân của bạn còn ${remainingMinutes} phút nữa. `;
          errorMsg += "Bạn chỉ có thể hủy sân trước giờ đặt ít nhất 2 tiếng.";
        }
        
        message.error(errorMsg);
        return;
      }

      // Hiển thị modal xác nhận
      Modal.confirm({
        title: 'Xác nhận hủy đặt sân',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>Bạn có chắc chắn muốn hủy đặt sân với các thông tin sau:</p>
            <p><strong>Sân:</strong> {bookingData.courtName}</p>
            <p><strong>Ngày:</strong> {dayjs(bookingData.date).format('DD/MM/YYYY')}</p>
            <p><strong>Thời gian:</strong> {bookingData.startTime} - {bookingData.endTime}</p>
            <p><strong>Họ tên:</strong> {bookingData.fullName}</p>
            <p className="text-red-500">⚠️ Lưu ý: Hành động này không thể hoàn tác!</p>
          </div>
        ),
        okText: 'Xác nhận hủy',
        cancelText: 'Quay lại',
        onOk: async () => {
          // Thực hiện hủy sân
          await deleteDoc(bookingRef);
          
          // Gửi email thông báo hủy sân
          await fetch('https://script.google.com/macros/s/AKfycbwJVBLvRETzdCHJTD8Jo6vmNmruLGn1Y9MdoiZocRvAe6MH_ECmeYG8XZOJPGzRYpF-4Q/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: bookingData.email,
              type: 'cancel',
              formData: {
                courtName: bookingData.courtName,
                date: bookingData.date,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime
              }
            })
          });

          message.success("Đã hủy đặt sân thành công!");
          setBookingCode('');
          setBookingInfo(null); // Reset bookingInfo khi hủy thành công
          setIsModalOpen(false);
        }
      });

    } catch (error) {
      console.error("Lỗi khi hủy sân:", error);
      message.error("Đã xảy ra lỗi khi hủy sân. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      title="Hủy Đặt Sân"
      centered
    >
      <Space direction="vertical" className="w-full mt-4">
        <Text>
          Vui lòng nhập mã đặt sân của bạn để hủy. Lưu ý: Bạn chỉ có thể hủy sân trước giờ đặt ít nhất 2 tiếng.
        </Text>
        
        <Input.Search
          placeholder="Nhập mã đặt sân của bạn"
          value={bookingCode}
          onChange={(e) => setBookingCode(e.target.value)}
          onSearch={handleCancel}
          loading={loading}
          enterButton="Kiểm tra"
        />

        {bookingInfo && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Title level={5}>Thông tin đặt sân của bạn:</Title>
            <p><strong>Sân:</strong> {bookingInfo.courtName}</p>
            <p><strong>Ngày:</strong> {dayjs(bookingInfo.date).format('DD/MM/YYYY')}</p>
            <p><strong>Thời gian:</strong> {bookingInfo.startTime} - {bookingInfo.endTime}</p>
            <p><strong>Họ tên:</strong> {bookingInfo.fullName}</p>
          </div>
        )}
      </Space>
    </Modal>
  );
} 