'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tooltip from "@/components/Tooltip";
import { useTheme } from '@/context/ThemeContext';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalTicketCombined: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const { data: callCenterData, error: callCenterError, isLoading: callCenterLoading } =
    useSWR('/api/total-ticket-call-center', fetcher, {
      refreshInterval: 30000 // refresh every 30 seconds
    });

  const { data: kantorCabangData, error: kantorCabangError, isLoading: kantorCabangLoading } =
    useSWR('/api/total-ticket-kantor-cabang', fetcher, {
      refreshInterval: 30000 // refresh every 30 seconds
    });

  // Default values if data is not loaded yet
  const callCenterTickets = callCenterData?.ticketData || [
    { type: 'Permohonan', total: 0 },
    { type: 'Komplaint', total: 0 }
  ];

  const kantorCabangTickets = kantorCabangData?.ticketData || [
    { type: 'Permohonan', total: 0 },
    { type: 'Komplaint', total: 0 }
  ];

  const allTotals = [
    ...callCenterTickets.map((item: any) => item.total),
    ...kantorCabangTickets.map((item: any) => item.total)
  ];
  const maxTotal = Math.max(...allTotals);

  // Calculate the total of all tickets for each category
  const totalCallCenterTickets = callCenterTickets.reduce(
    (sum: number, item: any) => sum + item.total, 0
  );

  const totalKantorCabangTickets = kantorCabangTickets.reduce(
    (sum: number, item: any) => sum + item.total, 0
  );

  // Get percentage width for the bars (scaled to max 100%)
  const getWidthPercentage = (total: number) => {
    return maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  };

  const isLoading = callCenterLoading || kantorCabangLoading;
  const hasError = callCenterError || kantorCabangError;

  if (isLoading) return (
      <Loading title="Total Calls Center & Kantor Cabang"/>
  );

  if (hasError) return (
      <Error title="Total Calls Center & Kantor Cabang" />
  );

  return (
    <div className="rounded-xl shadow-md bg-white dark:bg-gray-800 p-4 h-[22vh] transition-colors duration-200">
      <div className="flex justify-between items-center">

        <div className="mb-4 w-[50%]">
          <h3 className="text-md font-semibold mb-2 text-black dark:text-white">
            Total Ticket Call Center
            <Tooltip name={"Total Ticket Call Center"} position={'bottom'} />
          </h3>
          {callCenterTickets.map((item: any, index: number) => (
            <div key={`cc-${index}`} className="p-2 rounded-lg my-4">
              <div className="flex items-center">
                <div className="text-sm mr-3 w-32 text-black dark:text-white">{item.type}</div>
                <div className="flex-1 flex items-center">
                  <div
                    className={`${item.type === 'Permohonan' ? "bg-[#4472c4]" : "bg-amber-500"} h-6 rounded-sm`}
                    style={{ width: `${getWidthPercentage(item.total)}%` }}
                  ></div>
                  <div className="ml-2 text-sm font-semibold text-black dark:text-white">{item.total}</div>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="mb-4 w-[50%]">
          <h3 className="text-md font-semibold mb-2 text-black dark:text-white">
            Total Ticket Kantor Cabang
            <Tooltip name={"Total Ticket Kantor Cabang"} position={'left'} />
          </h3>
          {kantorCabangTickets.map((item: any, index: number) => (
            <div key={`kc-${index}`} className="p-2 rounded-lg my-4">
              <div className="flex items-center">
                <div className="text-sm mr-3 w-32 text-black dark:text-white">{item.type}</div>
                <div className="flex-1 flex items-center">
                  <div
                    className={`${item.type === 'Permohonan' ? "bg-[#4472c4]" : "bg-amber-500"} h-6 rounded-sm`}
                    style={{ width: `${getWidthPercentage(item.total)}%` }}
                  ></div>
                  <div className="ml-2 text-sm font-semibold text-black dark:text-white">{item.total}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TotalTicketCombined;
