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
    <WidgetCard title="Average Duration" className="relative" tooltipPosition="bottom">
      <div className="flex flex-col h-full justify-center">
        <div className="grid grid-cols-2 gap-3">
          {/* ASA */}
          <div className="flex flex-row justify-between items-center p-2">
            <div className="relative group">
              <div className="text-xs text-gray-600 mb-1">
                ASA
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-52 rounded bg-gray-800 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Average Speed of Answer merupakan rata-rata waktu yang dibutuhkan Agent dalam menjawab panggilan.
                </div>
              </div>
              <div className="text-xs">{asa}</div>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-fuchsia-200">
              <i className='bx bx-time' style={{ color: '#cc00da' }}></i>
            </div>
          </div>
          
          {/* ACD */}
          <div className="flex flex-row justify-between items-center p-2">
            <div className="relative group">
              <div className="text-xs text-gray-600 mb-1">
                ACD
                <div className="absolute bottom-full -translate-x-1/2 w-52 rounded bg-gray-800 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Average Call Duration merupakan rata-rata lama waktu yang dihabiskan selama satu panggilan telepon berlangsung antara Agent dan nasabah.
                </div>
              </div>
              <div className="text-xs">{acd}</div>
            </div>
            <div className={`px-2 py-0.5 rounded-full bg-red-200`}>
              <i className='bx bx-stopwatch' style={{ color: '#d8002a' }}></i>
            </div>
          </div>
          
          {/* ACW */}
          <div className="flex flex-row justify-between items-center p-2">
            <div className="relative group">
              <div className="text-xs text-gray-600 mb-1">
                ACW
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-52 rounded bg-gray-800 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Average After Call Work adalah rata-rata waktu yang dibutuhkan Agent untuk melakukan pekerjaan administrasi call, seperti input data dan lainnya.
                </div>
              </div>
              <div className="text-xs">{acw}</div>
            </div>
            <div className={`px-2 py-0.5 rounded-full bg-red-200`}>
              <i className='bx bx-stopwatch' style={{ color: '#ff0000' }}></i>
            </div>
          </div>
          
          {/* AHT */}
          <div className="flex flex-row justify-between items-center p-2">
            <div className="relative group">
              <div className="text-xs text-gray-600 mb-1">
                AHT
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 rounded bg-gray-800 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Average Handling Time adalah rata-rata waktu yang dihabiskan Agent untuk menangani satu panggilan.
                </div>
              </div>
              <div className="text-xs">{aht}</div>
            </div>
            <div className={`px-2 py-0.5 rounded-full bg-amber-200`}>
              <i className='bx bx-news' style={{ color: '#c78000' }}></i>
            </div>
          </div>
        
        </div>
      </div>
    </WidgetCard>
  );
};

export default AverageDuration;
