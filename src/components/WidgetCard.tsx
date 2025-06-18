import React, { ReactNode } from 'react';

interface WidgetCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`rounded-xl shadow-md bg-white p-4 ${(title === 'User Activity' || title === 'Call Category Inbound') ? 'h-[18vh]' : 'h-[22vh]'} ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
};

export default WidgetCard;
