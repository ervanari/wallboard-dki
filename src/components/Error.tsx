import React from "react";

interface ErrorProps {
    title: string;
}

export const Error: React.FC<ErrorProps> = ({title}) => {
    return (
        <div className="rounded-xl shadow-md bg-white p-4 md:p-6 h-auto min-h-[21vh] flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <div className="text-red-500">
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Error loading data
                </div>
            </div>
        </div>
    );
};
export default Error;
