"use client";

import React from 'react';
import { Column } from '@ant-design/plots';

// Dữ liệu mẫu long-form đúng chuẩn cho stacked column chart
const defaultData = [
  { year: '1991', value: 3, category: 'Len' },
  { year: '1991', value: 0, category: 'Bor' },
  { year: '1991', value: 0, category: 'Wiz' },
  { year: '1992', value: 4, category: 'Len' },
  { year: '1992', value: 0, category: 'Bor' },
  { year: '1992', value: 3, category: 'Wiz' },
  { year: '1993', value: 5, category: 'Len' },
  { year: '1993', value: 2, category: 'Bor' },
  { year: '1993', value: 4, category: 'Wiz' },
  { year: '1994', value: 6, category: 'Len' },
  { year: '1994', value: 4, category: 'Bor' },
  { year: '1994', value: 3, category: 'Wiz' },
  { year: '1995', value: 9, category: 'Len' },
  { year: '1995', value: 4, category: 'Bor' },
  { year: '1995', value: 3, category: 'Wiz' },
  { year: '1996', value: 10, category: 'Len' },
  { year: '1996', value: 6, category: 'Bor' },
  { year: '1996', value: 4, category: 'Wiz' },
  { year: '1997', value: 12, category: 'Len' },
  { year: '1997', value: 7, category: 'Bor' },
  { year: '1997', value: 5, category: 'Wiz' },
  { year: '1998', value: 8, category: 'Len' },
  { year: '1998', value: 6, category: 'Bor' },
  { year: '1998', value: 5, category: 'Wiz' },
  { year: '1999', value: 13, category: 'Len' },
  { year: '1999', value: 8, category: 'Bor' },
  { year: '1999', value: 7, category: 'Wiz' },
];

interface StackedBarChartProps {
  data?: {
    year: string;
    value: number;
    category: string;
  }[];
  title?: string;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data = defaultData, title }) => {
  const config = {
    data,
    isStack: true,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    color: ['#5B8FF9', '#5AD8A6', '#5D7092'], // Len, Bor, Wiz
    label: {
      position: 'middle',
      style: {
        fill: '#fff',
        fontSize: 12,
      },
    },
    tooltip: {
      shared: true,
      showMarkers: false,
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    interactions: [{ type: 'active-region' }],
  };

  return (
    <div className="mb-6">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <Column {...config} />
    </div>
  );
};

export default StackedBarChart; 