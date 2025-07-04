'use client';

import React, { useRef } from 'react';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useResizeObserver } from '@/hooks/useResizeObserver';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface CallCategoryInboundProps {
  containerWidth?: number;
  containerHeight?: number;
}

const CallCategoryInbound: React.FC<CallCategoryInboundProps> = ({ containerWidth, containerHeight }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(contentRef);

  const effectiveWidth = containerWidth || width;
  const effectiveHeight = containerHeight || height;

  const { data, error, isLoading } = useSWR('/api/call-category-inbound', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  const categoryData = data?.categoryData;

  const categoryNameFontSize = `clamp(10px, ${Math.max(effectiveWidth * 0.012, 1)}px, 16px)`;
  const countFontSize = `clamp(11px, ${Math.max(effectiveWidth * 0.014, 1)}px, 18px)`;

  if (isLoading) return (
      <Loading title="Call Category Inbound" />
  );

  if (error) return (
      <Error title="Call Category Inbound" />
  );

  const content = (
    <div ref={contentRef} className="w-full h-full min-w-0 min-h-0 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 md:gap-x-4 lg:gap-x-6 gap-y-2 md:gap-y-3 h-full">
        {categoryData.map((category: {
          name: string;
          count: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
        }, index: React.Key | null | undefined) => (
          <div key={index} className="flex items-center justify-between min-w-0 min-h-0 px-1">
            <div className="flex items-center gap-1 min-w-0 flex-1 mr-1">
              <span
                className="font-medium text-black dark:text-white truncate"
                style={{ fontSize: categoryNameFontSize }}
              >
                {category.name.trim()}
              </span>
            </div>
            <div className={`px-2 py-0.5 rounded bg-green-200 dark:bg-green-900 flex items-center gap-1 whitespace-nowrap`}>
              <span
                className="text-green-600 dark:text-green-400"
                style={{ fontSize: countFontSize }}
              >
                {category.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <WidgetCard title="Call Category Inbound" tooltipPosition="bottom">
      {content}
    </WidgetCard>
  );
};

export default CallCategoryInbound;
