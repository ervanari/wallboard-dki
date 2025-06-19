'use client';

import React from 'react';
import useSWR from 'swr';
import WidgetCard from './WidgetCard';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

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
      <Loading title="User Activity" />
  );
  
  if (error) return (
      <Error title="User Activity" />
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
