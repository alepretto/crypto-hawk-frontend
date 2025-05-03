'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
}

interface SidebarProps {
    user: {
        username: string;
    };
    items: SidebarItem[];
    onLogout: () => void;
}

export const Sidebar = ({ user, items, onLogout }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    
    useEffect(() => {
        const saved = localStorage.getItem('sidebarCollapsed');

        if (saved !== null) {
            setIsCollapsed(saved === 'true');
        }

    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(isCollapsed));
    }, [isCollapsed]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <>
            {/* Botão de Toggle para Mobile */}
            <button
                onClick={toggleMobileSidebar}
                className="fixed z-40 p-2 mt-2 ml-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100"
            >
                <span className="sr-only">Abrir sidebar</span>
                <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`h-screen transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-15' : 'w-54'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                bg-gray-50 dark:bg-gray-800`}
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    {/* Botão de Toggle para Desktop */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden md:flex items-center justify-center w-full p-2 mb-4 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                        {isCollapsed ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        )}
                    </button>

                    {/* Conteúdo do Usuário */}
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-2 mb-6'}`}>
                        {isCollapsed ? (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold my-4">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <p className='py-4'>Olá <span className="font-bold">{user.username}</span></p>
                        )}
                    </div>

                    {/* Itens do Menu */}
                    <ul className="space-y-2">
                        {items.map((item, index) => (
                            <li key={index}>
                                {item.href ? (
                                <Link
                                    href={item.href}
                                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    isCollapsed ? 'justify-center' : ''
                                    }`}
                                >
                                    <div className="flex-shrink-0">{item.icon}</div>
                                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                                </Link>
                                ) : (
                                <button
                                    onClick={item.onClick}
                                    className={`flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    isCollapsed ? 'justify-center' : ''
                                    } cursor-pointer`}
                                >
                                    <div className="flex-shrink-0">{item.icon}</div>
                                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                                </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
};