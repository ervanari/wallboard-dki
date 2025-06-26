'use client';

import React, { useRef } from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tooltip from "@/components/Tooltip";
import { useTheme } from '@/context/ThemeContext';
import { useResizeObserver } from '@/hooks/useResizeObserver';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface TotalTicketCombinedProps {
  containerWidth?: number;
  containerHeight?: number;
}

const TotalTicketCombined: React.FC<TotalTicketCombinedProps> = ({ containerWidth, containerHeight }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const contentRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(contentRef);

  // Use container dimensions if provided, otherwise use measured dimensions
  const effectiveWidth = containerWidth || width;
  const effectiveHeight = containerHeight || height;

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

  // Calculate dynamic font sizes based on container width
  const labelFontSize = `clamp(10px, ${Math.max(effectiveWidth * 0.01, 1)}px, 14px)`;
  const valueFontSize = `clamp(12px, ${Math.max(effectiveWidth * 0.012, 1)}px, 16px)`;
  const sectionTitleFontSize = `clamp(12px, ${Math.max(effectiveWidth * 0.015, 1)}px, 18px)`;

  // Calculate dynamic bar height
  const barHeight = `clamp(8px, ${Math.max(effectiveHeight * 0.04, 1)}px, 12px)`;

  const isLoading = callCenterLoading || kantorCabangLoading;
  const hasError = callCenterError || kantorCabangError;

  if (isLoading) return (
      <Loading title="Total Calls Center & Kantor Cabang"/>
  );

  if (hasError) return (
      <Error title="Total Calls Center & Kantor Cabang" />
  );

  const content = (
    <div ref={contentRef} className="flex flex-col md:flex-row justify-between items-stretch w-full h-full min-w-0 min-h-0">
      <div className="flex-1 min-w-0 min-h-0 md:mr-2">
        <h3
          className="font-semibold mb-1 md:mb-2 text-black dark:text-white flex items-center"
          style={{ fontSize: sectionTitleFontSize }}
        >
          Total Ticket Call Center
          <Tooltip name={"Total Ticket Call Center"} position={'bottom'} />
        </h3>
        <div className="flex flex-col justify-around h-[calc(100%-1.5rem)]">
          {callCenterTickets.map((item: any, index: number) => (
            <div key={`cc-${index}`} className="p-1 rounded-lg">
              <div className="flex items-center">
                <div
                  className="mr-2 w-[30%] text-black dark:text-white"
                  style={{ fontSize: labelFontSize }}
                >
                  {item.type}
                </div>
                <div className="flex-1 flex items-center min-w-0">
                  <div
                    className={`${item.type === 'Permohonan' ? "bg-[#4472c4]" : "bg-amber-500"} rounded-sm`}
                    style={{
                      width: `${getWidthPercentage(item.total)}%`,
                      height: barHeight
                    }}
                  ></div>
                  <div
                    className="ml-2 font-semibold text-black dark:text-white"
                    style={{ fontSize: valueFontSize }}
                  >
                    {item.total}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0 min-h-0 md:ml-2 mt-2 md:mt-0">
        <h3
          className="font-semibold mb-1 md:mb-2 text-black dark:text-white flex items-center"
          style={{ fontSize: sectionTitleFontSize }}
        >
          Total Ticket Kantor Cabang
          <Tooltip name={"Total Ticket Kantor Cabang"} position={'left'} />
        </h3>
        <div className="flex flex-col justify-around h-[calc(100%-1.5rem)]">
          {kantorCabangTickets.map((item: any, index: number) => (
            <div key={`kc-${index}`} className="p-1 rounded-lg">
              <div className="flex items-center">
                <div
                  className="mr-2 w-[30%] text-black dark:text-white"
                  style={{ fontSize: labelFontSize }}
                >
                  {item.type}
                </div>
                <div className="flex-1 flex items-center min-w-0">
                  <div
                    className={`${item.type === 'Permohonan' ? "bg-[#4472c4]" : "bg-amber-500"} rounded-sm`}
                    style={{
                      width: `${getWidthPercentage(item.total)}%`,
                      height: barHeight
                    }}
                  ></div>
                  <div
                    className="ml-2 font-semibold text-black dark:text-white"
                    style={{ fontSize: valueFontSize }}
                  >
                    {item.total}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <WidgetCard title="Total Ticket Call Center & Kantor Cabang">
      {content}
    </WidgetCard>
  );
};

export default TotalTicketCombined;
