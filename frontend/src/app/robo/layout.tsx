'use client';

import { Sidebar } from '@/components/sideBar';
import { useAuth } from '@/context/authContext';
import { ReactNode } from 'react';

import { Bot, LayoutDashboard, LogOut, Settings } from "lucide-react";

import { SidebarProvider } from '@/context/sidebarContext';


export default function RoboLayout({ children }: { children: ReactNode}) {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            icon: <Bot size={20} />,
            label: 'Bot',
            href: '/robo'
        },
        {
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            href: '/robo/dashboard'
        },
        {
            icon: <Settings size={20} />,
            label: 'Settings',
            href: '/robo/settings'
        },
        {
            icon: <LogOut size={20} />,
            label: 'Sair',
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
        
            <main className="flex-1 p-4 transition-all duration-300  overflow-hidden">
                    { children }
            </main>
        </SidebarProvider>
        </div>
    );
}