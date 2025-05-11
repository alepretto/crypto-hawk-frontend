'use client';

import { useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight } from "lucide-react";

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
}

export const Sidebar = ({ user, items }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    
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


    return (
        <div className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${isCollapsed ? "w-15" : "w-50"}`}>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                
                <span className={`${isCollapsed ? "hidden" : "block"} font-bold`}>Olá {user.username}</span>
                
                <button onClick={toggleSidebar} className='cursor-pointer'>
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>

            </div>
        
            <nav className="flex flex-col gap-4 p-4">
                {
                    items.map((item, index) => (
                        item.href ? (
                            <a key={index} href={item.href} className="flex items-center gap-3 hover:text-gray-300">
                                {item.icon}
                                {!isCollapsed && <span>{item.label}</span>}
                            </a>
                        ) : (
                            <button key={index} onClick={item.onClick} className="flex items-center gap-3 cursor-pointer hover:text-gray-300">
                                {item.icon}
                                {!isCollapsed && <span>{item.label}</span>}
                            </button>
                        )
                        
                    ))
                }
            </nav>
        </div>
      );
};