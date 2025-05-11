'use client'

import { createContext, useContext, useEffect, useState } from "react"


interface SidebarContextType {
    isCollapsed: boolean;
    toggle: () => void;
}



const SidebarContextType = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem(`sidebarCollapsed`);
        if (saved !== null) setIsCollapsed(saved === 'true');
    }, []);


    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(isCollapsed));
    }, [isCollapsed])

    const toggle = () => setIsCollapsed(prev => !prev);


    return (
        <SidebarContextType.Provider value={{ isCollapsed, toggle}}>
            {children}
        </SidebarContextType.Provider>
    );

}

export const useSidebar = () => {
    const context = useContext(SidebarContextType);
    if (!context) throw new Error(`useSidebar must be used inside SidebarProvider`);
    return context;
}

