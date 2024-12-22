"use client"

import { Bell, Maximize } from "lucide-react"
import { SearchComponent } from "../globals/search"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SidebarTrigger } from "../ui/sidebar"
import { Badge } from "../ui/badge"
import Link from "next/link"

export const HeaderComponent = () => {
    return (
        <div className="bg-sidebar flex-wrap h-max py-3 w-full flex items-center px-4 gap-2 lg:px-6 justify-between">
            <div className="flex gap-4 items-center">
                <SidebarTrigger className="w-6" />
                <div className="hidden md:block">
                    <SearchComponent />
                </div>
                <h4 className="md:hidden">LOGO</h4>
            </div>
            <div className="flex items-center gap-4 lg:gap-6 justify-end flex-1">
                <div className="block md:hidden">
                    <SearchComponent />
                </div>
                <Link href='/about'>
                    <Maximize className="text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer w-5 h-5" />
                </Link>
                <div className="relative inline-flex items-center">
                    <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground duration-300 cursor-pointer" />
                    <Badge
                        className="absolute -top-2 -right-2 h-4 w-4 bg-blue-600 flex items-center justify-center text-xs"
                    >
                        3
                    </Badge>
                </div>
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>HS</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}