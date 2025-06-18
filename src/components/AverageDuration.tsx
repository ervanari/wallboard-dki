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

  console.log('AverageDuration data:', data);
  // Default values if data is not loaded yet
  const acd = data?.acd || '03:45';
  const asa = data?.asa || '01:20';
  const aht = data?.aht || '05:15';
  const acw = data?.acw || '02:10';
  
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
    <WidgetCard title="Average Duration" className="relative">
      <div className="flex flex-col h-full justify-center mt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-row justify-between items-center p-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">ASA</div>
              <div className="text-xs">{asa}</div>
            </div>
            <div className={`px-2 py-0.5 rounded-full bg-fuchsia-200`}>
              <i className='bx bx-time' style={{color:'#cc00da'}}></i>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center p-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">ACD</div>
              <div className="text-xs">{acd}</div>
            </div>
            <div className={`px-2 py-0.5 rounded-full bg-red-200`}>
              <i className='bxr  bx-stopwatch'  style={{color:'#d8002a'}}></i>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center p-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">ACW</div>
              <div className="text-xs">{acw}</div>
            </div>
            <div className={`px-2 py-0.5 rounded-full bg-red-200`}>
              <i className='bxr  bx-stopwatch' style={{color:'#ff0000'}}></i>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center p-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">AHT</div>
              <div className="text-xs">{aht}</div>
            </div>
            <div className={`px-2 py-0.5 rounded-full bg-amber-200`}>
              <i className='bxr  bx-news'  style={{color:'#c78000'}}></i>
            </div>
          </div>
         
        </div>
      </div>
    </WidgetCard>
  );
};

export default AverageDuration;
