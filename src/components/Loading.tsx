import React, {ReactNode} from "react";

interface LoadingProps {
    title: string;
}

export const Loading: React.FC<LoadingProps> = ({title}) => {
    return (
        <div className="rounded-xl shadow-md bg-white dark:bg-gray-800 p-4 md:p-6 h-auto min-h-[21vh] flex items-center justify-center transition-colors duration-200">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">{title}</h3>
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </div>
            </div>
        </div>
    );
};
export default Loading;
