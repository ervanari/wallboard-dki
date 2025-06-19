'use client';

import React from 'react';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

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
      <Loading title="Call Activity & Abandoned"/>
  );
  
  if (error) return (
      <Error title="Call Activity & Abandoned" />
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
