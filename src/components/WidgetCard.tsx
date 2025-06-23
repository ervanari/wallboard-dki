import React, { ReactNode } from 'react';
import Tooltip from './Tooltip';

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
  return (
    <div className={`
      rounded-xl shadow-md bg-white p-2 sm:p-3 md:p-4
      ${(title === 'User Activity' || title === 'Call Category Inbound') ? 'h-[18vh]' : 'h-[22vh]'}
      ${className}
      overflow-hidden
    `}>
      <h3 className="text-sm md:text-base lg:text-lg font-semibold flex items-center mb-1 md:mb-2 text-black">
        {title}
        <Tooltip name={title} position={tooltipPosition} />
      </h3>
      <div className="widget-content h-[calc(100%-2rem)] w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default WidgetCard;
