import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { ChevronRight } from "lucide-react"
import { NavLink } from 'react-router-dom';

export function NavMain({ items }) {

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menú</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    item?.items
                        ? menuCollapsible(item)
                        : menuInline(item)
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

const menuCollapsible = (item) => {
    return (
        <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                    <NavLink to={subItem.url}>
                                        <span>{subItem.title}</span>
                                    </NavLink>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

const menuInline = (item) => {
    return (

        <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
                <NavLink to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                </NavLink>
            </SidebarMenuButton>
        </SidebarMenuItem>

    )
}