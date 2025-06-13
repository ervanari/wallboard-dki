'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

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
    <WidgetCard title="Average Duration">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Talk Time</div>
          <div className="text-2xl font-bold text-blue-600">{avgTalkTime}</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Hold Time</div>
          <div className="text-2xl font-bold text-yellow-600">{avgHoldTime}</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Handle Time</div>
          <div className="text-2xl font-bold text-green-600">{avgHandleTime}</div>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Wrap Up Time</div>
          <div className="text-2xl font-bold text-purple-600">{avgWrapUpTime}</div>
        </div>
      </div>
    </WidgetCard>
  );
};

export default AverageDuration;
