'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalTicketCallCenter: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/total-ticket-call-center', fetcher, {
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

  console.log('Ticket Data:', ticketData);
  console.log('Total Tickets:', totalTickets);

  if (isLoading) return <WidgetCard title="Total Ticket Call Center">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Total Ticket Call Center">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Total Ticket Call Center">
      {ticketData.map((item: any, index: number) => (
        <div key={index} className="p-3 rounded-lg">
          <div className="flex items-center">
            <div className="text-sm mr-3 w-32">{item.type}</div>
            <div className="flex-1 flex items-center">
              <div
                className="bg-[#4472c4] h-6"
                style={{ width: `80%` }}
              ></div>
              <div className="ml-2 text-sm font-semibold">{item.total}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="p-3 text-right text-sm font-bold">
        Total: {totalTickets}
      </div>
    </WidgetCard>
  );
};

export default TotalTicketCallCenter;
