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
    
    if (isLoading) return (
        <div className="rounded-xl shadow-md bg-white p-4 md:p-6 h-auto min-h-[21vh] flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Call Activity</h3>
                <div className="flex items-center justify-center text-gray-500">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="rounded-xl shadow-md bg-white p-4 md:p-6 h-auto min-h-[21vh] flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Call Activity</h3>
                <div className="text-red-500">
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Error loading data
                </div>
            </div>
        </div>
    );

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
