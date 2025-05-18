"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, ChevronLeft, ChevronRight, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSidebar } from "@/context/sidebarContext"


interface SidebarItem {
    icon: React.ElementType;
    name: string;
    href?: string;
    onClick?: () => void;
}


interface SidebarProps {
    user: {
        username: string;
    };
    items: SidebarItem[];
    className?: string
}

export function Sidebar({ className, user, items }: SidebarProps) {

    const pathname = usePathname()
    // const [collapsed, setCollapsed] = useState(false)

    const { isCollapsed, toggle } = useSidebar();


    return (
        <div
            className={cn(
                "flex flex-col border-r bg-background transition-all duration-300",
                isCollapsed ? "w-16" : "w-53",
                className,
            )}
            >
            <div className="flex h-14 items-center px-4 border-b">
                {!isCollapsed && <h2 className="text-lg font-semibold">Olá {user.username}</h2>}
                
                <Button variant="ghost" size="icon" className={cn("ml-auto cursor-pointer", isCollapsed && "mx-auto")} onClick={toggle}>
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            <nav className="flex-1 p-2 space-y-2">
                {items.map((item) => (
                    
                    item.onClick ? (
                        <button
                            key={item.name}
                            onClick={item.onClick}
                            className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-left cursor-pointer",
                            "hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </button>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href || "/"}
                                className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                    pathname === item.href
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        )
                ))}
            </nav>
        </div>
    )
}
