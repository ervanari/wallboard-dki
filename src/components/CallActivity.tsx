'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CallActivity: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/call-activity', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  console.log('Call Activity Data:', data);
  
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
  console.log('Max Abandoned Calls:', maxAbandoned);
  
  if (isLoading) return (
      <div className="rounded-xl shadow-md bg-white p-4 md:p-6 h-auto min-h-[22vh] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Call Activity</h3>
          <div className="flex items-center justify-center text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>
      </div>
  );
  
  if (error) return (
      <div className="rounded-xl shadow-md bg-white p-4 md:p-6 h-auto min-h-[22vh] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Call Activity</h3>
          <div className="text-red-500">
            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Error loading data
          </div>
        </div>
      </div>
  );
  
  return (
      <>
        <div className={`rounded-xl shadow-md bg-white p-4 h-[22vh]`}>
          <div className="flex justify-between">

            <div className="flex-row w-[100%] mr-10 h-full">
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

            <div className="flex-row w-[100%] h-full">
              <h3 className="text-lg font-semibold mb-3">Abandoned</h3>
              <div className="widget-content">
                <div className="flex flex-row mb-4 h-[14vh]">
                  <div className="flex flex-col items-center mr-7">
                    <div className="text-sm mb-2">{abandoneIvr}</div>
                    <div className="flex flex-col justify-end h-40 w-8 bg-gray-200 rounded">
                      <div
                          className="bg-amber-500 w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneIvr, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm mt-2">IVR</div>
                  </div>
                  
                  <div className="flex flex-col items-center mr-7">
                    <div className="text-sm mb-2">{abandoneQueue}</div>
                    <div className="flex flex-col justify-end h-40 w-8 bg-gray-200 rounded">
                      <div
                          className="bg-amber-500 w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneQueue, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm mt-2">Queue</div>
                  </div>
                  
                  <div className="flex flex-col items-center mr-7">
                    <div className="text-sm mb-2">{abandoneAgent}</div>
                    <div className="flex flex-col justify-end h-40 w-8 bg-gray-200 rounded">
                      <div
                          className="bg-amber-500 w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneAgent, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm mt-2">Agent</div>
                  </div>
                  
                  <div className="flex flex-col items-center mr-7">
                    <div className="text-sm mb-2">{abandoneTransfer}</div>
                    <div className="flex flex-col justify-end h-40 w-8 bg-gray-200 rounded">
                      <div
                          className="bg-amber-500 w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneTransfer, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm mt-2">Transfer</div>
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
