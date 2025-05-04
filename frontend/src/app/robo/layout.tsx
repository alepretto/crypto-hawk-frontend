'use client';

import { Sidebar } from '@/components/sideBar';
import { useAuth } from '@/context/authContext';
import { ReactNode } from 'react';

import { LayoutDashboard, LogOut } from "lucide-react";


export default function RoboLayout({ children }: { children: ReactNode}) {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            href: '/robo/dashboard'
        },
        {
            icon: <LogOut size={20} />,
            label: 'Sair',
            onClick: logout
        }
    ];

    return (
        <div className="flex h-screen">
        <Sidebar 
            user={{ username: user?.username || 'Usuário' }} 
            items={menuItems} 
        />
        
        <main className="flex-1 p-4 transition-all duration-300">
            { children }
        </main>
        </div>
    );
}