'use client';

import React, { useState, useRef, useEffect } from 'react';
import { tooltipText } from '@/utils/tooltipText';

type TooltipPosition = 'top' | 'right' | 'left' | 'bottom';

interface TooltipProps {
  name: string;
  position?: TooltipPosition;
}

const Tooltip: React.FC<TooltipProps> = ({ name, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const text = tooltipText[name] || 'No tooltip information available';

  // Adjust tooltip position if it goes off-screen
  useEffect(() => {
    if (isVisible && tooltipRef.current && iconRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newPosition = position;

      // Check if tooltip goes off the right edge
      if (tooltipRect.right > viewportWidth && position === 'right') {
        newPosition = 'left';
      }

      // Check if tooltip goes off the left edge
      if (tooltipRect.left < 0 && position === 'left') {
        newPosition = 'right';
      }

      // Check if tooltip goes off the top edge
      if (tooltipRect.top < 0 && position === 'top') {
        newPosition = 'bottom';
      }

      // Check if tooltip goes off the bottom edge
      if (tooltipRect.bottom > viewportHeight && position === 'bottom') {
        newPosition = 'top';
      }

      if (newPosition !== tooltipPosition) {
        setTooltipPosition(newPosition);
      }
    }
  }, [isVisible, position]);

  // Position classes based on the tooltip position
  const getPositionClasses = () => {
    switch (tooltipPosition) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-5 transform -translate-y-1/2 ml-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  // Arrow position classes
  const getArrowClasses = () => {
    switch (tooltipPosition) {
      case 'top':
        return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent';
      case 'right':
        return 'left-[-6px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent';
      case 'left':
        return 'right-[-6px] top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent';
      case 'bottom':
        return 'top-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent';
      default:
        return 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent';
    }
  };

  return (
    <div className="inline-flex z-10 items-center relative ml-1">
      <div
        ref={iconRef}
        className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-700 dark:text-gray-200 cursor-help transition-colors duration-200"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        ?
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-10 w-64 p-2 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded shadow-lg transition-colors duration-200 ${getPositionClasses()}`}
        >
          {text}
          <div className={`absolute w-0 h-0 border-4 border-gray-800 dark:border-gray-700 ${getArrowClasses()}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
