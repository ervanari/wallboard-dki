'use client';

import React from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CallCategoryInbound: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/call-category-inbound', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  const categoryData = data?.categoryData;

  if (isLoading) return (
      <Loading title="Call Category Inbound" />
  );

  if (error) return (
      <Error title="Call Category Inbound" />
  );

  return (
    <WidgetCard title="Call Category Inbound" tooltipPosition="right">
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-3 md:gap-4 mt-6">
        {categoryData.map((category: { name: string; count: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2 p-2">
                <span className="text-sm font-semibold">{category.name.trim()}</span>
              </div>
              <div className={`px-2 py-0.5 rounded bg-green-200 flex items-center gap-1`}>
                <span className="text-sm text-green-600">{category.count}</span>
              </div>
            </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default CallCategoryInbound;
