'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Abandoned from '@/components/Abandoned';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CallActivity: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/call-activity', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const activeCall = data?.activeCall || 12;
  const waitingCall = data?.waitingCall || 3;
  const totalAgents = data?.totalAgents || 25;
  const availableAgents = data?.availableAgents || 18;

  if (isLoading) return <WidgetCard title="Call Activity">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Call Activity">Error loading data</WidgetCard>;

  return (
      <>
        <div className={`rounded-xl shadow-md bg-white p-4 h-[21vh]`}>
          <div className="flex justify-between items-center">
            
            <div className="flex-row w-[30%]">
              <h3 className="text-lg font-semibold mb-3">Agents</h3>
              <div className="widget-content">
                <div className="flex justify-between text-center items-center mb-4">
                  <div className="text-sm text-gray-600">
                    <div className="bg-[#d0f7fb] rounded-md p-2 mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-user'></i>
                    </div>
                    Incoming
                  </div>
                  <div className="text-sm font-bold text-blue-600">{totalAgents}</div>
                </div>
                <div className="flex justify-between text-center items-center">
                  <div className="text-sm text-gray-600">
                    <div className="bg-[#d0f7fb] rounded-md p-2 mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-user-check'></i>
                    </div>
                    Answered
                  </div>
                  <div className="text-sm font-bold text-green-600">{availableAgents}</div>
                </div>
              </div>
            </div>
            
            <div className="flex-row w-[60%]">
              <h3 className="text-lg font-semibold mb-3">Call Activity</h3>
              <div className="widget-content">
                <div className="flex justify-between text-center items-center mb-4">
                  <div className="text-sm text-gray-600">
                    <div className="bg-[#d0f7fb] rounded-md p-2 mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-phone-incoming'></i>
                    </div>
                    Active Calls
                  </div>
                  <div className="text-sm font-bold text-blue-600">{activeCall}</div>
                </div>
                <div className="flex justify-between text-center items-center">
                  <div className="text-sm text-gray-600">
                    <div className="bg-[#d0f7fb] rounded-md p-2 mr-2 inline-flex items-center justify-center">
                      <i className='bx bx-phone-incoming'></i>
                    </div>
                    Waiting Calls
                  </div>
                  <div className="text-sm font-bold text-yellow-500">{waitingCall}</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        
        
      </>
  );
};

export default CallActivity;
