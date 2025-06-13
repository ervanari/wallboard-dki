'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TicketStatus: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/ticket-status', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const openTickets = data?.openTickets || 42;
  const inProgressTickets = data?.inProgressTickets || 28;
  const resolvedTickets = data?.resolvedTickets || 65;
  const closedTickets = data?.closedTickets || 103;

  if (isLoading) return <WidgetCard title="Ticket Status">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Ticket Status">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Ticket Status">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{openTickets}</div>
          <div className="text-sm text-gray-600">Open</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(openTickets / (openTickets + inProgressTickets + resolvedTickets + closedTickets)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-500">{inProgressTickets}</div>
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${(inProgressTickets / (openTickets + inProgressTickets + resolvedTickets + closedTickets)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{resolvedTickets}</div>
          <div className="text-sm text-gray-600">Resolved</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${(resolvedTickets / (openTickets + inProgressTickets + resolvedTickets + closedTickets)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-600">{closedTickets}</div>
          <div className="text-sm text-gray-600">Closed</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-gray-600 h-2 rounded-full"
              style={{ width: `${(closedTickets / (openTickets + inProgressTickets + resolvedTickets + closedTickets)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
};

export default TicketStatus;
