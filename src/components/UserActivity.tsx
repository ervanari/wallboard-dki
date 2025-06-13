'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const UserActivity: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/user-activity', fetcher, {
    refreshInterval: 10000 // refresh every 10 seconds for more real-time updates
  });

  // Default values if data is not loaded yet
  const agentData = data?.agentData || [
    { name: 'Andi Wijaya', status: 'active', duration: '01:23', activity: 'Call' },
    { name: 'Budi Santoso', status: 'active', duration: '00:45', activity: 'Call' },
    { name: 'Cindy Paramita', status: 'idle', duration: '00:12', activity: 'Wrap Up' },
    { name: 'Deni Hermawan', status: 'break', duration: '00:08', activity: 'Break' },
    { name: 'Eka Putri', status: 'active', duration: '00:37', activity: 'Call' },
    { name: 'Fandi Ahmad', status: 'idle', duration: '00:03', activity: 'Ready' },
    { name: 'Gita Nirmala', status: 'offline', duration: '00:00', activity: 'Offline' },
    { name: 'Hadi Gunawan', status: 'active', duration: '00:52', activity: 'Call' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'break':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  if (isLoading) return <WidgetCard title="User Activity">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="User Activity">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="User Activity">
      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agentData.map((agent, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{agent.name}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(agent.status)}`}></span>
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{agent.duration}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{agent.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
};

export default UserActivity;
