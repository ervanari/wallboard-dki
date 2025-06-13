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
    <div className={`rounded-xl shadow-md bg-white p-4 h-[21vh] ${className}`}>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
};

export default WidgetCard;
