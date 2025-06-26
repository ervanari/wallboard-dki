import React, { ReactNode, useRef } from 'react';
import Tooltip from './Tooltip';
import { useResizeObserver } from '@/hooks/useResizeObserver';

interface WidgetCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  tooltipPosition?: 'top' | 'right' | 'left' | 'bottom';
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  children,
  className = '',
  tooltipPosition
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(containerRef);

  const titleFontSize = `clamp(14px, ${Math.max(width * 0.02, 1)}px, 20px)`;

  return (
    <div
      ref={containerRef}
      className={`
        rounded-xl shadow-md bg-white dark:bg-gray-800 p-2 sm:p-3 md:p-4
        h-[22vh] min-h-0 min-w-0
        ${className}
        overflow-hidden transition-colors duration-200
      `}
    >
      <h3
        className="font-semibold flex items-center mb-1 md:mb-2 text-black dark:text-white"
        style={{ fontSize: titleFontSize }}
      >
        {title}
        <Tooltip name={title} position={tooltipPosition} />
      </h3>
      <div className="widget-content h-[calc(100%-2rem)] w-full min-h-0 min-w-0 overflow-hidden">
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, { containerWidth: width, containerHeight: height })
            : child
        )}
      </div>
    </div>
  );
};

export default WidgetCard;
