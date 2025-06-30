'use client';

import React, { useRef } from 'react';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tooltip from "@/components/Tooltip";
import WidgetCard from './WidgetCard';
import { useResizeObserver } from '@/hooks/useResizeObserver';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface CallActivityProps {
  containerWidth?: number;
  containerHeight?: number;
}

const CallActivity: React.FC<CallActivityProps> = ({ containerWidth, containerHeight }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(contentRef);

  // Use container dimensions if provided, otherwise use measured dimensions
  const effectiveWidth = containerWidth || width;
  const effectiveHeight = containerHeight || height;

  const { data, error, isLoading } = useSWR('/api/call-activity', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const incomingCall = data?.incomingCall || 0;
  const queueCall = data?.queueCall || 0;
  const answerCall = data?.answerCall || 0;
  const abandoneIvr = data?.abandoneIvr || 0;
  const abandoneQueue = data?.abandoneQueue || 0;
  const abandoneAgent = data?.abandoneAgent || 0;
  const abandoneTransfer = data?.abandoneTransfer || 0;

  // Calculate percentage for bar heights
  const calculatePercentage = (value: number, max: number) => {
    return max > 0 ? (value / max) * 100 : 0;
  };

  // Find the maximum value for abandoned calls to scale the bars
  const maxAbandoned = Math.max(abandoneIvr, abandoneQueue, abandoneAgent, abandoneTransfer);

  // Calculate dynamic font sizes based on container width
  const labelFontSize = `clamp(10px, ${Math.max(effectiveWidth * 0.01, 1)}px, 14px)`;
  const valueFontSize = `clamp(12px, ${Math.max(effectiveWidth * 0.012, 1)}px, 16px)`;
  const sectionTitleFontSize = `clamp(12px, ${Math.max(effectiveWidth * 0.015, 1)}px, 18px)`;
  const tooltipFontSize = `clamp(8px, ${Math.max(effectiveWidth * 0.008, 1)}px, 10px)`;

  // Calculate dynamic sizes for bars and icons
  const barWidth = `clamp(6px, ${Math.max(effectiveWidth * 0.015, 1)}px, 12px)`;
  const iconSize = Math.max(Math.min(effectiveWidth * 0.03, 20), 12);

  if (isLoading) return (
      <Loading title="Call Activity & Abandoned"/>
  );

  if (error) return (
      <Error title="Call Activity & Abandoned" />
  );

  const content = (
    <div ref={contentRef} className="flex flex-col md:flex-row justify-between h-full w-full min-w-0 min-h-0">
      <div className="flex-1 flex flex-col min-w-0 min-h-0 md:mr-4">
        <h3
          className="font-semibold mb-1 md:mb-2 flex items-center text-black dark:text-white"
          style={{ fontSize: sectionTitleFontSize }}
        >
          Call Activity
          <Tooltip name={"Call Activity"} position={'right'} />
        </h3>
        <div className="flex-1 overflow-hidden flex flex-col justify-center">
          {/* Incoming */}
          <div className="flex justify-between items-center mb-2 md:mb-4">
            <div
              className="text-black dark:text-white flex items-center relative group"
              style={{ fontSize: labelFontSize }}
            >
              <div className="bg-[#d0f7fb] dark:bg-blue-900 rounded-md p-1 mr-1 inline-flex items-center justify-center">
                <i className='bx bx-user' style={{ fontSize: iconSize }}></i>
              </div>
              Incoming
              <div
                className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-[clamp(120px,30vw,200px)] rounded bg-gray-800 dark:bg-gray-700 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                style={{ fontSize: tooltipFontSize }}
              >
                Jumlah panggilan masuk ke Call Center.
              </div>
            </div>
            <div
              className="font-bold text-blue-600 dark:text-blue-400"
              style={{ fontSize: valueFontSize }}
            >
              {incomingCall}
            </div>
          </div>

          {/* Answered */}
          <div className="flex justify-between items-center">
            <div
              className="text-black dark:text-white flex items-center relative group"
              style={{ fontSize: labelFontSize }}
            >
              <div className="bg-[#d0f7fb] dark:bg-blue-900 rounded-md p-1 mr-1 inline-flex items-center justify-center">
                <i className='bx bx-user-check' style={{ fontSize: iconSize }}></i>
              </div>
              Answered
              <div
                className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-[clamp(120px,30vw,200px)] rounded bg-gray-800 dark:bg-gray-700 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                style={{ fontSize: tooltipFontSize }}
              >
                Jumlah panggilan yang berhasil dijawab oleh Agent.
              </div>
            </div>
            <div
              className="font-bold text-green-600 dark:text-green-400"
              style={{ fontSize: valueFontSize }}
            >
              {answerCall}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-0 mt-2 md:mt-0">
        <h3
          className="font-semibold mb-1 md:mb-2 flex items-center text-black dark:text-white"
          style={{ fontSize: sectionTitleFontSize }}
        >
          Abandoned
          <Tooltip name={"Abandoned"} position={'bottom'} />
        </h3>
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-row justify-around h-full">
            {/* IVR */}
            <div className="flex flex-col items-center flex-1 min-w-0 min-h-0">
              <div
                className="mb-1 text-black dark:text-white"
                style={{ fontSize: valueFontSize }}
              >
                {abandoneIvr}
              </div>
              <div
                className="flex flex-col justify-end flex-1 bg-gray-200 dark:bg-gray-600 rounded"
                style={{ width: barWidth }}
              >
                <div
                  className="bg-amber-500 dark:bg-amber-600 w-full rounded-t"
                  style={{ height: `${calculatePercentage(abandoneIvr, maxAbandoned)}%` }}
                ></div>
              </div>
              <div
                className="mt-1 flex items-center relative group text-black dark:text-white"
                style={{ fontSize: labelFontSize }}
              >
                IVR
                <div
                  className="absolute left-full transform -translate-y-1/2 ml-2 w-[clamp(120px,30vw,200px)] rounded bg-gray-800 dark:bg-gray-700 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{ fontSize: tooltipFontSize }}
                >
                  Jumlah panggilan yang ditutup oleh nasabah saat masih berada di menu IVR (Interactive Voice Response), sebelum masuk ke antrean atau bicara dengan Agent.
                </div>
              </div>
            </div>

            {/* Queue */}
            <div className="flex flex-col items-center flex-1 min-w-0 min-h-0">
              <div
                className="mb-1 text-black dark:text-white"
                style={{ fontSize: valueFontSize }}
              >
                {abandoneQueue}
              </div>
              <div
                className="flex flex-col justify-end flex-1 bg-gray-200 dark:bg-gray-600 rounded"
                style={{ width: barWidth }}
              >
                <div
                  className="bg-amber-500 dark:bg-amber-600 w-full rounded-t"
                  style={{ height: `${calculatePercentage(abandoneQueue, maxAbandoned)}%` }}
                ></div>
              </div>
              <div
                className="mt-1 flex items-center relative group text-black dark:text-white"
                style={{ fontSize: labelFontSize }}
              >
                Queue
                <div
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[clamp(120px,30vw,200px)] rounded bg-gray-800 dark:bg-gray-700 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{ fontSize: tooltipFontSize }}
                >
                  Jumlah panggilan yang ditutup oleh nasabah saat sudah masuk antrean, namun belum sempat dijawab oleh Agent.
                </div>
              </div>
            </div>

            {/* Agent */}
            <div className="flex flex-col items-center flex-1 min-w-0 min-h-0">
              <div
                className="mb-1 text-black dark:text-white"
                style={{ fontSize: valueFontSize }}
              >
                {abandoneAgent}
              </div>
              <div
                className="flex flex-col justify-end flex-1 bg-gray-200 dark:bg-gray-600 rounded"
                style={{ width: barWidth }}
              >
                <div
                  className="bg-amber-500 dark:bg-amber-600 w-full rounded-t"
                  style={{ height: `${calculatePercentage(abandoneAgent, maxAbandoned)}%` }}
                ></div>
              </div>
              <div
                className="mt-1 flex items-center relative group text-black dark:text-white"
                style={{ fontSize: labelFontSize }}
              >
                Agent
                <div
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[clamp(120px,30vw,200px)] rounded bg-gray-800 dark:bg-gray-700 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{ fontSize: tooltipFontSize }}
                >
                  Jumlah panggilan yang ditutup oleh nasabah saat terhubung ke Agent.
                </div>
              </div>
            </div>

            {/* Transfer */}
            <div className="flex flex-col items-center flex-1 min-w-0 min-h-0">
              <div
                className="mb-1 text-black dark:text-white"
                style={{ fontSize: valueFontSize }}
              >
                {abandoneTransfer}
              </div>
              <div
                className="flex flex-col justify-end flex-1 bg-gray-200 dark:bg-gray-600 rounded"
                style={{ width: barWidth }}
              >
                <div
                  className="bg-amber-500 dark:bg-amber-600 w-full rounded-t"
                  style={{ height: `${calculatePercentage(abandoneTransfer, maxAbandoned)}%` }}
                ></div>
              </div>
              <div
                className="mt-1 flex items-center relative group text-black dark:text-white"
                style={{ fontSize: labelFontSize }}
              >
                Transfer
                <div
                  className="absolute right-full transform -translate-y-1/2 mr-2 w-[clamp(120px,30vw,200px)] rounded bg-gray-800 dark:bg-gray-700 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{ fontSize: tooltipFontSize }}
                >
                  Jumlah panggilan yang ditutup oleh nasabah saat panggilan sedang dalam proses dialihkan (transfer) ke Agent sebelum transfer berhasil.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <WidgetCard title="Call Activity & Abandoned" tooltipPosition="bottom">
      {content}
    </WidgetCard>
  );
};

export default CallActivity;
