"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/source/firebaseConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Định nghĩa interface cho dữ liệu đặt sân
interface Booking {
  id: string;
  courtId: number;
  courtName: string;
  date: string;
  duration: string;
  email: string;
  endTime: string;
  fullName: string;
  phone: string;
  price: number;
  startTime: string;
  timestamp: Timestamp;
  totalPrice: number;
}

// Định nghĩa interface cho dữ liệu thống kê theo ngày
interface DailyRevenue {
  date: string;
  revenue: number;
  bookings: number;
}

// Định nghĩa interface cho dữ liệu thống kê theo tuần
interface WeeklyRevenue {
  week: string;
  revenue: number;
  bookings: number;
  startDate: string;
  endDate: string;
}

// Định nghĩa interface cho dữ liệu thống kê theo sân
interface CourtRevenue {
  name: string;
  value: number;
  bookings: number;
}

// Định nghĩa interface cho tooltip của biểu đồ cột
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DailyRevenue;
  }>;
  label?: string;
}

// Định nghĩa interface cho tooltip của biểu đồ tròn
interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: CourtRevenue;
    percent: number;
  }>;
}

// Định nghĩa interface cho tooltip của biểu đồ line
interface LineTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    color: string;
    payload: DailyRevenue;
  }>;
  label?: string;
}

// Mảng màu cho biểu đồ tròn
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function DashboardPage() {
  // const [ setBookings] = useState<FormDataType[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyRevenue[]>([]);
  const [courtRevenue, setCourtRevenue] = useState<CourtRevenue[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const bookingsData: Booking[] = [];
        querySnapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
        });

        // setBookings(bookingsData);
        processBookingData(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
      }
    };

    fetchBookings();
  }, []);

  const processBookingData = (data: Booking[]) => {
    // Tính tổng doanh thu và số lượng đặt sân
    const total = data.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );
    setTotalRevenue(total);
    setTotalBookings(data.length);

    // Xử lý dữ liệu theo ngày
    const dailyData: Record<string, DailyRevenue> = {};

    data.forEach((booking) => {
      const date = booking.date;
      if (!dailyData[date]) {
        dailyData[date] = { date, revenue: 0, bookings: 0 };
      }
      dailyData[date].revenue += booking.totalPrice || 0;
      dailyData[date].bookings += 1;
    });

    // Chuyển đối tượng thành mảng và sắp xếp theo ngày
    const dailyRevenueArray = Object.values(dailyData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setDailyRevenue(dailyRevenueArray);

    // Xử lý dữ liệu theo tuần
    const weeklyData: Record<string, WeeklyRevenue> = {};

    data.forEach((booking) => {
      const date = new Date(booking.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Bắt đầu từ Chủ nhật
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // Kết thúc vào Thứ 7
      
      const weekKey = weekStart.toISOString().split('T')[0];
      const weekLabel = `Tuần ${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { 
          week: weekLabel, 
          revenue: 0, 
          bookings: 0,
          startDate: weekStart.toISOString().split('T')[0],
          endDate: weekEnd.toISOString().split('T')[0]
        };
      }
      weeklyData[weekKey].revenue += booking.totalPrice || 0;
      weeklyData[weekKey].bookings += 1;
    });

    // Chuyển đối tượng thành mảng và sắp xếp theo tuần
    const weeklyRevenueArray = Object.values(weeklyData).sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    setWeeklyRevenue(weeklyRevenueArray);

    // Xử lý dữ liệu theo sân
    const courtData: Record<string, CourtRevenue> = {};

    data.forEach((booking) => {
      const courtName = booking.courtName || `Sân ${booking.courtId}`;
      if (!courtData[courtName]) {
        courtData[courtName] = { name: courtName, value: 0, bookings: 0 };
      }
      courtData[courtName].value += booking.totalPrice || 0;
      courtData[courtName].bookings += 1;
    });

    const courtRevenueArray = Object.values(courtData);
    setCourtRevenue(courtRevenueArray);
  };

  // Format số tiền VND
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Custom tooltip cho biểu đồ cột
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{`Ngày: ${label}`}</p>
          <p className="text-blue-600">{`Doanh thu: ${formatCurrency(
            payload[0].value
          )}`}</p>
          <p className="text-gray-600">{`Số lượt đặt: ${payload[0].payload.bookings}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip cho biểu đồ tròn
  const PieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length) {
    // Lấy totalRevenue từ scope ngoài hoặc truyền vào props nếu cần
    const value = payload[0].value;
    const percent =
      totalRevenue > 0 ? ((value / totalRevenue) * 100).toFixed(2) : "0.00";
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-blue-600">{`Doanh thu: ${formatCurrency(value)}`}</p>
        <p className="text-gray-600">{`Số lượt đặt: ${payload[0].payload.bookings}`}</p>
        <p className="text-gray-600">{`Tỷ lệ: ${percent}%`}</p>
      </div>
    );
  }
  return null;
};

  // Custom tooltip cho biểu đồ line
  const LineTooltip = ({ active, payload, label }: LineTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{`Ngày: ${label}`}</p>
          {payload.map((entry, index) => (
            <p 
              key={index} 
              style={{ color: entry.color }}
              className="font-medium"
            >
              {entry.name}: {entry.dataKey === 'revenue' 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 max-w-full overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6">Thống kê doanh thu</h1>

        {/* Thẻ hiển thị tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Tổng doanh thu
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Tổng số lượt đặt sân
            </h2>
            <p className="text-3xl font-bold text-green-600">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Doanh thu trung bình / ngày
            </h2>
            <p className="text-3xl font-bold text-purple-600">
              {dailyRevenue.length > 0
                ? formatCurrency(totalRevenue / dailyRevenue.length)
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Biểu đồ doanh thu theo ngày */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Doanh thu theo ngày</h2>
          <div
            className="w-full"
            style={{ height: "50vh", minHeight: "300px", maxHeight: "500px" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyRevenue}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  height={60}
                  tick={{ fontSize: windowWidth < 768 ? 10 : 12 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ line - Xu hướng doanh thu */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Xu hướng doanh thu</h2>
          <div
            className="w-full"
            style={{ height: "50vh", minHeight: "300px", maxHeight: "500px" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyRevenue}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  height={60}
                  tick={{ fontSize: windowWidth < 768 ? 10 : 12 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tickFormatter={(value) => `${value / 1000}K`} />
                <Tooltip content={<LineTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Doanh thu" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  name="Số lượt đặt" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ doanh thu theo sân */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Doanh thu theo sân
            </h2>
            <div className="w-full overflow-x-auto">
              <div
                style={{
                  minWidth: windowWidth < 640 ? 320 : 0, // Đảm bảo không bị bóp nhỏ trên mobile
                  height: windowWidth < 640 ? "220px" : "45vh",
                  minHeight: "220px",
                  maxHeight: "350px",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courtRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={
                        windowWidth < 640 ? 60 : windowWidth < 768 ? 80 : 120
                      }
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={windowWidth < 640 ? false : (entry) => entry.name}
                    >
                      {courtRevenue.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                      layout={windowWidth < 768 ? "horizontal" : "vertical"}
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{
                        overflowX: windowWidth < 768 ? "auto" : "visible",
                        maxWidth: windowWidth < 640 ? 200 : "none",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bảng chi tiết doanh thu theo sân */}
          <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">
              Chi tiết doanh thu theo sân
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Sân</th>
                    <th className="py-2 px-4 border-b text-right">
                      Số lượt đặt
                    </th>
                    <th className="py-2 px-4 border-b text-right">Doanh thu</th>
                    <th className="py-2 px-4 border-b text-right">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {courtRevenue.map((court, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{court.name}</td>
                      <td className="py-2 px-4 border-b text-right">
                        {court.bookings}
                      </td>
                      <td className="py-2 px-4 border-b text-right">
                        {formatCurrency(court.value)}
                      </td>
                      <td className="py-2 px-4 border-b text-right">
                        {`${((court.value / totalRevenue) * 100).toFixed(2)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="py-2 px-4 border-b font-bold">Tổng</td>
                    <td className="py-2 px-4 border-b text-right font-bold">
                      {totalBookings}
                    </td>
                    <td className="py-2 px-4 border-b text-right font-bold">
                      {formatCurrency(totalRevenue)}
                    </td>
                    <td className="py-2 px-4 border-b text-right font-bold">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
