'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CallActivity: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/call-activity', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const incomingCall = data?.incomingCall || 0;
  const queueCall = data?.queueCall || 0;
  const answerCall = data?.answerCall || 0;
  const abandoneIvr = data?.abandoneIvr || 0;
  const abandoneQueue = data?.abandoneQueue || 0;

  // Calculate percentage for bar heights
  const calculatePercentage = (value: number, max: number) => {
    return max > 0 ? (value / max) * 100 : 0;
  };

  // Find the maximum value for abandoned calls to scale the bars
  const maxAbandoned = Math.max(abandoneIvr, abandoneQueue);

  if (isLoading) return <WidgetCard title="Call Activity">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Call Activity">Error loading data</WidgetCard>;

  return (
      <>
        <div className={`rounded-xl shadow-md bg-white p-4 h-[21vh]`}>
          <div className="flex justify-between items-center">

            <div className="flex-row w-[30%] h-full">
              <h3 className="text-lg font-semibold mb-3">Call Activity</h3>
              <div className="widget-content">
                <div className="flex justify-between text-center items-center mb-4">
                  <div className="text-sm text-gray-600">
                    <div className="bg-[#d0f7fb] rounded-md p-2 mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-user'></i>
                    </div>
                    Incoming
                  </div>
                  <div className="text-sm font-bold text-blue-600">{incomingCall}</div>
                </div>
                <div className="flex justify-between text-center items-center mb-4">
                  <div className="text-sm text-gray-600">
                    <div className="bg-[#d0f7fb] rounded-md p-2 mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-time'></i>
                    </div>
                    Queue
                  </div>
                  <div className="text-sm font-bold text-yellow-600">{queueCall}</div>
                </div>
                <div className="flex justify-between text-center items-center">
                  <div className="text-sm text-gray-600">
                    <div className="bg-[#d0f7fb] rounded-md p-2 mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-user-check'></i>
                    </div>
                    Answered
                  </div>
                  <div className="text-sm font-bold text-green-600">{answerCall}</div>
                </div>
              </div>
            </div>

            <div className="flex-row w-[50%] h-full">
              <h3 className="text-lg font-semibold mb-3">Abandoned</h3>
              <div className="widget-content">
                <div className="flex flex-row text-center items-center mb-4">
                  <div className="flex flex-col items-center mr-7">
                    <div className="text-sm mb-2">{abandoneIvr}</div>
                    <div className="flex flex-col justify-end h-40 w-8 bg-gray-200 rounded">
                      <div
                          className="bg-[#4472c4] w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneIvr, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-semibold mt-2">IVR</div>
                  </div>
                  <div className="flex flex-col items-center mr-7">
                    <div className="text-sm mb-2">{abandoneQueue}</div>
                    <div className="flex flex-col justify-end h-40 w-8 bg-gray-200 rounded">
                      <div
                          className="bg-[#4472c4] w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneQueue, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-semibold mt-2">Queue</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </>
  );
};

export default CallActivity;
