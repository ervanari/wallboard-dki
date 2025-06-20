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

export default function Wallboard() {
    return (
        <main className="min-h-screen bg-gray-50 p-4 overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Image
                        src="/logo-bank.png"
                        alt="Bank DKI Logo"
                        width={120}
                        height={100}
                        className="mr-4"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-black">CALL CENTER WALLBOARD</h1>
                </div>
                <div className="text-right flex flex-row items-end">
                    <div className="text-sm mb-2 mr-2">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <LogoutButton />
                </div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-4">
                {/* First Row */}
                <div className="col-span-2">
                    <ServiceLevel />
                </div>
                <div className="col-span-5">
                    <CallActivity />
                </div>
                <div className="col-span-5">
                    <TotalCall />
                </div>

                {/* Second Row */}
                <div className="col-span-2">
                    <AverageDuration />
                </div>
                <div className="col-span-5">
                    <TicketStatus />
                </div>
                <div className="col-span-5">
                    <TotalTicketCombined />
                </div>

                {/* Third Row */}
                <div className="col-span-3">
                    <Top5Department />
                </div>
                <div className="col-span-3">
                    <Top5KantorCabang />
                </div>
                <div className="col-span-3">
                    <TicketPermohonan />
                </div>
                <div className="col-span-3">
                    <TicketComplaint />
                </div>

                {/* Fourth Row */}
                <div className="col-span-6">
                    <CallCategoryInbound />
                </div>
                <div className="col-span-6">
                    <UserActivity />
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
