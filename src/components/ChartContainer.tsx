import React, { ReactNode } from 'react';

interface ChartContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * A reusable container component for charts that ensures proper resizing
 * and prevents overflow issues.
 *
 * This component applies responsive styling and proper overflow handling
 * to ensure charts resize correctly when their parent container changes size.
 */
const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        w-full h-full
        flex items-center justify-center
        overflow-hidden
        min-w-0 min-h-0
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ChartContainer;
