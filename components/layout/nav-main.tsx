"use client"

import { ChevronRight, icons, Minus } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar"
import { Fragment, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type itemProps = {
  title: string
  url: string
  icon?: string
  isActive?: boolean
  type?: string
  permissions: string | null
  sub_menu?: {
    title: string
    url: string
    permissions: string[]
  }[]
}

interface props {
  items: itemProps[]
}

export function NavMain({ items, }: props) {

  const { isMobile, state } = useSidebar()

  const getLucideIcon = (Icon: string) => {
    if (!Icon) return null;
    const formattedIcon = Icon.charAt(0).toUpperCase() + Icon.slice(1);
    const IconComponent = icons[formattedIcon as keyof typeof icons];
    return IconComponent ? <IconComponent /> : null;
  };

  const { setRequiredPermissions } = useAuth()
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState(0)
  const [subActiveIndex, setSubActiveIndex] = useState(-1)
  // const [closeIndex, setCloseIndex] = useState(-1)

  useEffect(() => {
    if (items && Array.isArray(items) && items?.length > 0) {
      const menus = items
      menus.forEach((menu: any, i: number) => {
        if (menu?.sub_menu && menu.sub_menu?.length > 0 && menu.type === 'Sub') {
          menu.sub_menu?.forEach((subMenu: any, j: number) => {
            if (subMenu?.url === pathname) {
              setActiveIndex(i)
              setSubActiveIndex(j)
            }
          })
        } else {
          if (menu.url === pathname) {
            setActiveIndex(i)
          }
        }
      })
    }
  }, [items, pathname])

  const SubItemCom = ({item, index, className} : {item: itemProps, index: number, className?: string}) => {
    return (
      <SidebarMenuSub className={cn(className && className)}>
        {item.sub_menu?.map((subItem, i) => (
          <SidebarMenuSubItem key={i}>
            <SidebarMenuSubButton asChild
              className={cn(
                "text-muted-foreground hover:text-foreground transition-all ease-in-out duration-300 h-9",
                activeIndex === index && subActiveIndex === i && 'bg-custom-gradient text-foreground',
              )}
              onClick={() => { setActiveIndex(index); setSubActiveIndex(i); }}
            >
              <Link href={subItem.url} className={cn(
                "hover:rounded-md hover:pl-3",
                activeIndex === index && subActiveIndex === i && "pl-5 hover:pl-5",
              )} onClick={() => setRequiredPermissions(item?.permissions || null)} >
                <Minus className="w-[8px!important]" />
                {subItem.title}
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    )
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item, index) => (

          item?.type === 'Sub' ? (
            /** Sub Menus */
            <Fragment key={index}>
              {state === 'collapsed' && !isMobile ? (

                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton
                      className="text-muted-foreground h-9 hover:text-foreground transition-all hover:rounded-md ease-in-out duration-300"
                    >
                      {item.icon && getLucideIcon(item.icon)}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent side="right" className="px-0 w-auto ml-1.5">
                    <div className="px-2 mb-2 flex items-center gap-2">
                      {item.icon && getLucideIcon(item.icon)}
                      <h4 className="uppercase font-semibold tracking-wider">{item?.title}</h4>
                    </div>
                    <SubItemCom item={item} index={index} />
                  </PopoverContent>
                </Popover>

              ) : (

                <Collapsible
                  key={item.title}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild className="rounded-lg">
                      <SidebarMenuButton
                        className="text-muted-foreground h-9 hover:text-foreground transition-all hover:rounded-md ease-in-out duration-300"
                      >
                        {item.icon && getLucideIcon(item.icon)}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SubItemCom item={item} index={index} className={'w-[94%]'} />
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

              )}

            </Fragment>

          ) : (
            /** Direct Link */
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild
                className={cn(
                  "text-muted-foreground hover:text-foreground transition-all ease-in-out duration-300 h-9",
                  activeIndex === index && 'bg-custom-gradient text-foreground',
                )}
                onClick={() => { setActiveIndex(index); setSubActiveIndex(-1) }}
              >
                <Link href={item.url} className="rounded-md" onClick={() => setRequiredPermissions(item?.permissions || null)}>
                  {item.icon && getLucideIcon(item.icon)}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )

        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
