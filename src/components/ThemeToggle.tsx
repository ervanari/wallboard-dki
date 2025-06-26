'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-200 shadow-md hover:shadow-lg"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <span className="flex items-center">
          <i className='bx bx-sun text-xl'></i>
          <span className="ml-2 hidden sm:inline">Light Mode</span>
        </span>
      ) : (
        <span className="flex items-center">
          <i className='bx bx-moon text-xl'></i>
          <span className="ml-2 hidden sm:inline">Dark Mode</span>
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
