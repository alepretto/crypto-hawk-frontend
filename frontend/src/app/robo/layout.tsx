'use client';

import { Sidebar } from './components/sidebar';

import { useAuth } from '@/context/authContext';
import { ReactNode } from 'react';

import { Bot, LayoutDashboard, LogOut, Settings } from "lucide-react";

import { SidebarProvider } from '@/context/sidebarContext';


export default function RoboLayout({ children }: { children: ReactNode}) {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            icon: Bot,
            name: 'Bot',
            href: '/robo'
        },
        {
            icon: LayoutDashboard,
            name: 'Dashboard',
            href: '/robo/dashboard'
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