'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { tooltipText } from '@/utils/tooltipText';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type StatusItem = {
  no: number;
  ticket_status: string;
  status_id: number;
  total: number;
};


const TicketStatus: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/ticket-status', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  const rawStatusData: StatusItem[] = data?.rawStatusData || [];

  const statusConfig: Record<number, { bg: string; icon?: React.ReactNode }> = {
    1: { bg: 'bg-blue-100', icon: <span className="text-blue-600"><i className='bx bx-time'></i> </span> },
    2: { bg: 'bg-red-100', icon: <span className="text-red-600">< i className='bx bx-bell' style={{color:'#e80000'}}></i> </span> },
    3: { bg: 'bg-orange-100', icon: <span className="text-red-600">< i className='bx bx-check'  style={{color:'#d98500'}}></i> </span> },
    4: { bg: 'bg-green-100', icon: <span className="text-green-600">< i className='bx bx-check-circle'  style={{color:'#08de00'}}></i> </span> },
    5: { bg: 'bg-gray-100', icon: <span className="text-gray-600">< i className='bx bx-x'  style={{color:'#545454'}}></i> </span> },
  };

  if (isLoading) return (
      <Loading title="Ticket Status" />
  );

  if (error) return (
      <Error title="Ticket Status" />
  );

  return (
    <WidgetCard title="Ticket Status" tooltipPosition="bottom">
      <div className="rounded-xl p-6 w-full">
        <div className="grid grid-cols-2 gap-y-4 gap-x-20">
          {rawStatusData.map((item) => {
            const config = statusConfig[item.no];
            const trimmedStatus = item.ticket_status.trim().toUpperCase();
            return (
                <div key={item.no} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 relative group">
                    <div className={`px-2 py-0.5 rounded ${config?.bg || "bg-gray-100"}`}>
                      {config?.icon}
                    </div>
                    <span className="text-sm font-medium">
                      {trimmedStatus}
                    </span>
                    {tooltipText[trimmedStatus] && (
                        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-52 rounded bg-gray-800 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {tooltipText[trimmedStatus]}
                        </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">{item.total}</span>
                </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
};

export default TicketStatus;
