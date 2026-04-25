'use client';

import { DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface RevenueStatsProps {
  revenueStats: {
    totalRevenue: number;
    paidCount: number;
  };
  totalBookings: number;
}

const RevenueStats: React.FC<RevenueStatsProps> = ({ revenueStats, totalBookings }) => {
  return (
    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-0">
      <div className="w-full max-w-xs mx-auto bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <DollarOutlined className="text-2xl md:text-3xl text-green-500 mr-3" />
          <div>
            <h3 className="text-base md:text-lg font-semibold">Tổng doanh thu</h3>
            <p className="text-xl md:text-2xl font-bold text-green-600">
              {revenueStats.totalRevenue.toLocaleString()} VND
            </p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-xs mx-auto bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <CheckCircleOutlined className="text-2xl md:text-3xl text-blue-500 mr-3" />
          <div>
            <h3 className="text-base md:text-lg font-semibold">Đặt sân đã thanh toán</h3>
            <p className="text-xl md:text-2xl font-bold text-blue-600">
              {revenueStats.paidCount} / {totalBookings}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueStats;