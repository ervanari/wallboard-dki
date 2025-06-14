'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

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
    1: { bg: 'bg-blue-100', icon: <span className="text-blue-600">🆕</span> },
    2: { bg: 'bg-green-100', icon: <span className="text-green-600">✅</span> },
    4: { bg: 'bg-red-100', icon: <span className="text-red-600">❌</span> },
    5: { bg: 'bg-yellow-100', icon: <span className="text-yellow-600">⏳</span> },
    6: { bg: 'bg-gray-100', icon: <span className="text-gray-600">🔓</span> },
    11: { bg: 'bg-gray-200', icon: <span className="text-gray-500">🔒</span> }
  };
  
  if (isLoading) return <WidgetCard title="Ticket Status">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Ticket Status">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Ticket Status">
      <div className="rounded-xl p-6 bg-white shadow-md w-full max-w-xl">
        <h2 className="text-center text-xl font-bold mb-4">Ticket Status</h2>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          {rawStatusData.map((item) => {
            const config = statusConfig[item.status_id];
            return (
                <div key={item.no} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded ${config?.bg || "bg-gray-100"}`}>
                      {config?.icon || <Bell className="w-4 h-4 text-gray-600" />}
                    </div>
                    <span className="text-sm font-medium">{item.ticket_status.trim()}</span>
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
