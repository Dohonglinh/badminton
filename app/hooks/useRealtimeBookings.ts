import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/app/source/firebaseConfig";

// ✅ Định nghĩa kiểu dữ liệu Booking
interface Booking {
  id: string;
  courtId: number;
  courtName: string;
  fullName: string;
  phone: string;
  email: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  createdAt?: "";
}

export const useRealtimeBookings = (courtId?: number, selectedDate?: string) => {  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sửa điều kiện kiểm tra để xử lý đúng ID = 0 dạng chuỗi hoặc số
if (courtId === null || courtId === undefined || !selectedDate) {      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`Đang tải bookings cho sân ID: ${courtId}, ngày: ${selectedDate}`);

    const bookingsQuery = query(
      collection(db, "bookings"),
      where("courtId", "==", courtId),
      where("date", "==", selectedDate)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingsData: Booking[] = [];
        snapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
        });
        console.log(`Đã tải ${bookingsData.length} booking cho sân ID: ${courtId}`);
        setBookings(bookingsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Lỗi khi lắng nghe đặt sân theo thời gian thực:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu đặt sân");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [courtId, selectedDate]);

  return { bookings, loading, error };
};