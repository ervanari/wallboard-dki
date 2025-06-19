'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from './Loading';
import Error from './Error';

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
      <Loading title="Average Duration"/>
  );

  if (error) return (
      <Error title="Average Duration" />
  );

  return (
    <WidgetCard title="Average Duration" className="relative" tooltipPosition="right">
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
