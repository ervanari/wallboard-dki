'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CallCategoryInbound: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/call-category-inbound', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const categoryData = data?.categoryData || [
    { name: 'Informasi Produk', count: 145, icon: '📱' },
    { name: 'Transaksi', count: 128, icon: '💳' },
    { name: 'Keluhan', count: 87, icon: '⚠️' },
    { name: 'Rekening', count: 76, icon: '💰' },
    { name: 'Kartu Kredit', count: 65, icon: '💳' },
    { name: 'Mobile Banking', count: 58, icon: '📲' },
    { name: 'Internet Banking', count: 52, icon: '🖥️' },
    { name: 'Lainnya', count: 45, icon: '📋' }
  ];

  if (isLoading) return <WidgetCard title="Call Category Inbound">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Call Category Inbound">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Call Category Inbound">
      <div className="grid grid-cols-4 gap-3">
        {categoryData.map((category, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-3 text-center flex flex-col items-center justify-center"
          >
            <div className="text-2xl mb-1">{category.icon}</div>
            <div className="text-lg font-bold text-blue-600">{category.count}</div>
            <div className="text-xs text-gray-600 mt-1 line-clamp-1">{category.name}</div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default CallCategoryInbound;
