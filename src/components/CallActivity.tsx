'use client';

import React from 'react';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tooltip from "@/components/Tooltip";

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
  const abandoneAgent = data?.abandoneAgent || 0;
  const abandoneTransfer = data?.abandoneTransfer || 0;

  // Calculate percentage for bar heights
  const calculatePercentage = (value: number, max: number) => {
    return max > 0 ? (value / max) * 100 : 0;
  };

  // Find the maximum value for abandoned calls to scale the bars
  const maxAbandoned = Math.max(abandoneIvr, abandoneQueue, abandoneAgent, abandoneTransfer);

  if (isLoading) return (
      <Loading title="Call Activity & Abandoned"/>
  );

  if (error) return (
      <Error title="Call Activity & Abandoned" />
  );

  return (
      <>
        <div className={`rounded-xl shadow-md bg-white dark:bg-gray-800 p-2 sm:p-3 md:p-4 h-[22vh] overflow-hidden transition-colors duration-200`}>
          <div className="flex flex-col md:flex-row justify-between h-full">

            <div className="flex-1 flex flex-col min-w-0 md:mr-4 h-full">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2 flex items-center text-black dark:text-white">
                Call Activity
                <Tooltip name={"Call Activity"} position={'bottom'} />
              </h3>
              <div className="widget-content flex-1 overflow-hidden mt-5">
                {/* Incoming */}
                <div className="flex justify-between text-center items-center mb-2 md:mb-4">
                  <div className="text-xs sm:text-sm text-black dark:text-white flex items-center relative group">
                    <div className="bg-[#d0f7fb] dark:bg-blue-900 rounded-md p-1 sm:p-2 mr-1 sm:mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-user'></i>
                    </div>
                    Incoming
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-52 rounded bg-gray-800 dark:bg-gray-700 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Jumlah panggilan masuk ke Call Center.
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{incomingCall}</div>
                </div>

                {/* Answered */}
                <div className="flex justify-between text-center items-center">
                  <div className="text-xs sm:text-sm text-black dark:text-white flex items-center relative group">
                    <div className="bg-[#d0f7fb] dark:bg-blue-900 rounded-md p-1 sm:p-2 mr-1 sm:mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-user-check'></i>
                    </div>
                    Answered
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-40 sm:w-52 rounded bg-gray-800 dark:bg-gray-700 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Jumlah panggilan yang berhasil dijawab oleh Agent.
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-green-600 dark:text-green-400">{answerCall}</div>
                </div>

              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-full">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2 flex items-center text-black dark:text-white">
                Abandoned
                <Tooltip name={"Abandoned"} position={'bottom'} />
              </h3>
              <div className="widget-content flex-1 overflow-hidden">
                <div className="flex flex-row justify-around h-full">
                  {/* IVR */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-xs sm:text-sm mb-1 text-black dark:text-white">{abandoneIvr}</div>
                    <div className="flex flex-col justify-end flex-1 w-6 sm:w-8 bg-gray-200 dark:bg-gray-600 rounded">
                      <div
                          className="bg-amber-500 dark:bg-amber-600 w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneIvr, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs sm:text-sm mt-1 flex items-center relative group text-black dark:text-white">
                      IVR
                      <div className="absolute left-full transform -translate-y-1/2 ml-2 w-40 sm:w-52 rounded bg-gray-800 dark:bg-gray-700 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Jumlah panggilan yang ditutup oleh nasabah saat masih berada di menu IVR (Interactive Voice Response), sebelum masuk ke antrean atau bicara dengan Agent.
                      </div>
                    </div>
                  </div>

                  {/* Queue */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-xs sm:text-sm mb-1 text-black dark:text-white">{abandoneQueue}</div>
                    <div className="flex flex-col justify-end flex-1 w-6 sm:w-8 bg-gray-200 dark:bg-gray-600 rounded">
                      <div
                          className="bg-amber-500 dark:bg-amber-600 w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneQueue, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs sm:text-sm mt-1 flex items-center relative group text-black dark:text-white">
                      Queue
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 sm:w-52 rounded bg-gray-800 dark:bg-gray-700 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Jumlah panggilan yang ditutup oleh nasabah saat sudah masuk antrean, namun belum sempat dijawab oleh Agent.
                      </div>
                    </div>
                  </div>

                  {/* Agent */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-xs sm:text-sm mb-1 text-black dark:text-white">{abandoneAgent}</div>
                    <div className="flex flex-col justify-end flex-1 w-6 sm:w-8 bg-gray-200 dark:bg-gray-600 rounded">
                      <div
                          className="bg-amber-500 dark:bg-amber-600 w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneAgent, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs sm:text-sm mt-1 flex items-center relative group text-black dark:text-white">
                      Agent
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 sm:w-52 rounded bg-gray-800 dark:bg-gray-700 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Jumlah panggilan yang ditutup oleh nasabah saat terhubung ke Agent.
                      </div>
                    </div>
                  </div>

                  {/* Transfer */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-xs sm:text-sm mb-1 text-black dark:text-white">{abandoneTransfer}</div>
                    <div className="flex flex-col justify-end flex-1 w-6 sm:w-8 bg-gray-200 dark:bg-gray-600 rounded">
                      <div
                          className="bg-amber-500 dark:bg-amber-600 w-full rounded-t"
                          style={{ height: `${calculatePercentage(abandoneTransfer, maxAbandoned)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs sm:text-sm mt-1 flex items-center relative group text-black dark:text-white">
                      Transfer
                      <div className="absolute right-full transform -translate-y-1/2 mr-2 w-40 sm:w-52 rounded bg-gray-800 dark:bg-gray-700 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Jumlah panggilan yang ditutup oleh nasabah saat panggilan sedang dalam proses dialihkan (transfer) ke Agent sebelum transfer berhasil.
                      </div>
                    </div>
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
