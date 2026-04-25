import dayjs from "dayjs";


export interface FormDataType {
  key?: string;
  courtId: number;
  courtName: string;
  fullName: string;
  phone: string;
  email: string;
  date: dayjs.Dayjs | null;
  startTime: string;
  duration: string | number;
  endTime: string;
  totalPrice: number;
  // timestamp: any; // Using any for Firebase timestamp
  isPaid: boolean;
  bookingCode?: string; // Thêm bookingCode là optional
  // paidAt?: any; // Option
  
  // Các trường cho đặt sân theo tháng
  isMonthly?: boolean;
  monthlyStartDate?: string;
  monthlyEndDate?: string;
  hoursPerSession?: number;
  discountPercent?: number;
}
export interface CourtType {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
}