'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Abandoned: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/abandoned', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const abandonedCalls = data?.abandonedCalls || 8;
  const abandonedRate = data?.abandonedRate || 3.2;

  if (isLoading) return <WidgetCard title="Abandoned">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Abandoned">Error loading data</WidgetCard>;

  return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-5xl font-bold text-red-500">{abandonedCalls}</div>
        <div className="text-sm text-gray-600 mt-2">Abandoned Calls</div>
        <div className="mt-4 text-2xl font-semibold text-red-400">{abandonedRate}%</div>
        <div className="text-sm text-gray-600">Abandoned Rate</div>
      </div>
  );
};

export default Abandoned;
