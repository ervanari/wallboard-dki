'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalTicketKantorCabang: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/total-ticket-kantor-cabang', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const ticketData = data?.ticketData || [
    { type: 'Permohonan', total: 0 },
    { type: 'Komplaint', total: 0 }
  ];

  // Find the maximum total for scaling the bars
  const maxTotal = Math.max(...ticketData.map((item: any) => item.total));

  // Calculate the total of all tickets
  const totalTickets = ticketData.reduce((sum: number, item: any) => sum + item.total, 0);

  // Get data for specific types
  const getDataByType = (type: string) => {
    const item = ticketData.find((item: any) => item.type === type);
    return item ? item.total : 0;
  };

  // Get percentage width for the bars (scaled to max 100%)
  const getWidthPercentage = (total: number) => {
    return maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  };

  if (isLoading) return <WidgetCard title="Total Ticket Kantor Cabang" tooltipPosition="left">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Total Ticket Kantor Cabang" tooltipPosition="left">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Total Ticket Kantor Cabang" tooltipPosition="left">
      {ticketData.map((item: any, index: number) => (
        <div key={index} className="p-3 rounded-lg">
          <div className="flex items-center">
            <div className="text-sm mr-3 w-32 text-black dark:text-white">{item.type}</div>
            <div className="flex-1 flex items-center">
              <div
                className="bg-[#6A5ACD] h-6"
                style={{ width: `${getWidthPercentage(item.total)}%` }}
              ></div>
              <div className="ml-2 text-sm font-semibold text-black dark:text-white">{item.total}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="p-3 text-right text-sm font-bold text-black dark:text-white">
        Total: {totalTickets}
      </div>
    </WidgetCard>
  );
};

export default TotalTicketKantorCabang;
