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
    <div className={`rounded-xl shadow-md bg-white p-4 ${(title === 'User Activity' || title === 'Call Category Inbound') ? 'h-[18vh]' : 'h-[22vh]'} ${className}`}>
      <h3 className="text-lg font-semibold flex items-center">
        {title}
        <Tooltip name={title} position={tooltipPosition} />
      </h3>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
};

export default WidgetCard;
