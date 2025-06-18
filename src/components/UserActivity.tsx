'use client';

import React from 'react';
import useSWR from 'swr';
import WidgetCard from './WidgetCard';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type AgentData = {
  name: string;
  status: string;
  duration: string;
  activity: string;
};

const UserActivity: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/user-activity', fetcher, {
    refreshInterval: 10000 // refresh every 10 seconds for more real-time updates
  });

  const agentData = data?.agentData || [];

  // Status configuration for icons and colors based on agent status
  const statusConfig: Record<string, { bg: string; textColor: string; icon: React.ReactNode }> = {
    active: {
      bg: 'bg-green-100',
      textColor: 'text-green-600',
      icon: <i className='bx bx-check-circle text-green-500 text-lg'></i>
    },
    offline: {
      bg: 'bg-red-100',
      textColor: 'text-red-600',
      icon: <i className='bx bx-x-circle text-red-500 text-lg'></i>
    },
    idle: {
      bg: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      icon: <i className='bx bx-time text-yellow-500 text-lg'></i>
    },
    break: {
      bg: 'bg-blue-100',
      textColor: 'text-blue-600',
      icon: <i className='bx bx-coffee text-blue-500 text-lg'></i>
    }
  };

  if (isLoading) return (
    <div className="rounded-xl shadow-md bg-white p-4 md:p-6 h-auto min-h-[21vh] flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">User Activity</h3>
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
    <div className="rounded-xl shadow-md bg-white p-4 md:p-6 h-auto min-h-[21vh] flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">User Activity</h3>
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
      <WidgetCard title="User Activity">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-6">
          {agentData.map((agent: AgentData, index: number) => {
            const config = statusConfig[agent.status] || {
              bg: 'bg-gray-100',
              textColor: 'text-gray-600',
              icon: <i className='bx bx-user text-gray-500 text-lg'></i>
            };
  
            return (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className={`flex p-2 rounded-md items-center justify-center`}>
                    {config.icon}
                  </div>
                  <span className="text-sm font-medium truncate max-w-[120px]">{agent.name}</span>
                </div>
                <div className={`px-2 py-1 rounded ${config.bg} flex items-center gap-1`}>
                  <span className={`text-sm font-semibold ${config.textColor}`}>
                    {agent.activity.split(' ')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </WidgetCard>
  );
};

export default UserActivity;
