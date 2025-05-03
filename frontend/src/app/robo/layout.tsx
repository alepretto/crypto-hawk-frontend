'use client';

import { Sidebar } from '@/components/sideBar';
import { useAuth } from '@/context/authContext';
import { ReactNode } from 'react';

export default function RoboLayout({ children }: { children: ReactNode}) {
    const { user, logout } = useAuth();

    const menuItems = [
        {
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 22 21">
            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
            </svg>
        ),
        label: 'Dashboard',
        href: '/robo/dashboard'
        },
        {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
        ),
        label: 'Sair',
        onClick: logout
        }
    ];

    return (
        <div className="flex h-screen">
        <Sidebar 
            user={{ username: user?.username || 'Usuário' }} 
            items={menuItems} 
            onLogout={logout} 
        />
        
        <main className="flex-1 p-4 transition-all duration-300">
            { children }
        </main>
        </div>
    );
}