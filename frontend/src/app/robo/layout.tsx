'use client';

import { Sidebar } from './components/sidebar';

import { useAuth } from '@/context/authContext';
import { ReactNode } from 'react';

import { CandlestickChart, LayoutDashboard, LogOut, Settings, FileSearch, Bot } from "lucide-react";

import { SidebarProvider } from '@/context/sidebarContext';
// Receipt

export default function RoboLayout({ children }: { children: ReactNode}) {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            icon: LayoutDashboard,
            name: 'Dashboard',
            href: '/robo/dashboard'
        },
        {
            icon: CandlestickChart,
            name: 'Bot',
            href: '/robo/broker'
        },
        {
            icon: Bot,
            name: 'Live Session',
            href: '/robo/live-session'
        },
        {
            icon: FileSearch,
            name: 'backtest',
            href: '/robo/backtest'
        },
        {
            icon: Settings,
            name: 'Settings',
            href: '/robo/settings'
        },
        {
            icon: LogOut,
            name: 'Sair',
            onClick: logout
        }
    ];

    return (
        <div className="flex h-screen overflow-hidden">
        <SidebarProvider>
            <Sidebar 
                user={{ username: user?.username || 'Usuário' }} 
                items={menuItems} 
            />
        
            <main className="flex-1 p-4 transition-all duration-300 overflow-y-auto">
                    { children }
            </main>
        </SidebarProvider>
        </div>
    );
}