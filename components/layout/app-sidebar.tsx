"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ScrollArea } from "../ui/scroll-area"
import { useFetchSideMenu } from "@/hooks/app-hooks"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

const menu = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      type: 'Sub',
      // isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      type: 'Sub',
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      type: 'Sub',
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      type: 'Sub',
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Settings1",
      url: "#",
      type: 'Link',
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading }: any = useFetchSideMenu();
  const pathname = usePathname()
  const { setRequiredPermissions } = useAuth()

  /** To Set Required Permission In First Load */
  React.useEffect(() => {
    if (data?.data && Array.isArray(data.data) && data?.data?.length > 0) {
      const menus = data.data
      menus.forEach((menu: any) => {
        if (menu?.sub_menu && menu.sub_menu?.length > 0 && menu.type === 'Sub') {
          menu.sub_menu?.forEach((subMenu: any) => {
            if (subMenu?.url === pathname) {
              setRequiredPermissions(subMenu.permissions)
            }
          })
        } else {
          if (menu.url === pathname) {
            setRequiredPermissions(menu.permissions)
          }
        }
      })
    }
  }, [data?.data, pathname])

  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader>
        <TeamSwitcher teams={menu.teams} />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <NavMain items={data?.data || []} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={menu.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
