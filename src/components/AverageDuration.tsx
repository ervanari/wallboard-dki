'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const AverageDuration: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/average-duration', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const avgTalkTime = data?.avgTalkTime || '03:45';
  const avgHoldTime = data?.avgHoldTime || '01:20';
  const avgHandleTime = data?.avgHandleTime || '05:15';
  const avgWrapUpTime = data?.avgWrapUpTime || '02:10';

  if (isLoading) return <WidgetCard title="Average Duration">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Average Duration">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Average Duration" className="relative">
      <div className="absolute top-2 right-2">
        <Image src="/avg.png" alt="Average Duration Icon" width={24} height={24} />
      </div>
      <div className="flex flex-col h-full justify-center">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Talk Time</div>
            <div className="text-xl font-bold text-blue-600">{avgTalkTime}</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Hold Time</div>
            <div className="text-xl font-bold text-yellow-600">{avgHoldTime}</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Handle Time</div>
            <div className="text-xl font-bold text-green-600">{avgHandleTime}</div>
          </div>
          <div className="flex flex-col items-center p-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Wrap Up Time</div>
            <div className="text-xl font-bold text-purple-600">{avgWrapUpTime}</div>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
};

export default AverageDuration;
