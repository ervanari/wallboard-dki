'use client';

import React from 'react';
import Image from 'next/image';
import ServiceLevel from '@/components/ServiceLevel';
import CallActivity from '@/components/CallActivity';
import TotalCall from '@/components/TotalCall';
import AverageDuration from '@/components/AverageDuration';
import TicketStatus from '@/components/TicketStatus';
import TotalTicketCombined from '@/components/TotalTicketCombined';
import Top5Department from '@/components/Top5Department';
import Top5KantorCabang from '@/components/Top5KantorCabang';
import TicketPermohonan from '@/components/TicketPermohonan';
import TicketComplaint from '@/components/TicketComplaint';
import CallCategoryInbound from '@/components/CallCategoryInbound';
import UserActivity from '@/components/UserActivity';
import LogoutButton from '@/components/LogoutButton';
import ThemeToggle from "@/components/ThemeToggle";

export default function Wallboard() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden transition-colors duration-200">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 gap-2 sm:gap-4">
                <div className="flex items-center">
                    <Image
                        src="/logo-bank.png"
                        alt="Bank DKI Logo"
                        width={120}
                        height={100}
                        className="mr-2 sm:mr-4 w-[80px] h-auto sm:w-[100px] md:w-[120px]"
                        priority
                    />
                </div>
                <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black dark:text-white text-[clamp(18px,5vw,32px)]">
                        CALL CENTER WALLBOARD
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-2">
                    <div className="text-xs sm:text-sm text-center sm:text-right text-[clamp(10px,2vw,14px)] mb-0 sm:mb-2">
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    <div className="flex flex-row gap-1 sm:gap-2">
                        <ThemeToggle />
                        <LogoutButton />
                    </div>
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-2 md:gap-3 lg:gap-4">
                {/* First Row */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3">
                    <Top5Department />
                </div>
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3">
                    <Top5KantorCabang />
                </div>
                <div className="col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-3">
                    <TicketPermohonan />
                </div>
                <div className="col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-3">
                    <TicketComplaint />
                </div>

                {/* Second Row */}
                <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2">
                    <ServiceLevel />
                </div>
                <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3">
                    <AverageDuration />
                </div>
                <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-4">
                    <CallActivity />
                </div>
                <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3">
                    <TicketStatus />
                </div>

                {/* Third Row */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                    <TotalTicketCombined />
                </div>
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                    <CallCategoryInbound />
                </div>
                <div className="col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-4">
                    <UserActivity />
                </div>

                {/* Fourth Row */}
                <div className="col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-12">
                    <TotalCall />
                </div>

            </div>

            {/* Clock Update Script */}
            <script dangerouslySetInnerHTML={{
                __html: `
          function updateClock() {
            const clockElement = document.getElementById('clock');
            if (clockElement) {
              clockElement.textContent = new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });
            }
          }
          setInterval(updateClock, 1000);
        `
            }} />
        </main>
    );
}
