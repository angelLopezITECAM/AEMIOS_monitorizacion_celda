import { Sparkle, FolderKanban, LayoutPanelLeft } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
} from "@/components/ui/sidebar"

import { HeaderSidebar } from "./sidebar/header-sidebar"
import { NavMain } from "./sidebar/nav-main";


// Menu items.
const data = {
    navMain: [
        {
            title: "Dashboards",
            url: "#",
            icon: FolderKanban,
            isActive: true,
            items: [
                {
                    title: "Bombas",
                    url: "/dashboard/bombas",
                },
                {
                    title: "Termopar",
                    url: "/dashboard/termopar",
                },
            ],
        },
        {
            title: "Panel de control",
            url: "/panel-control",
            icon: LayoutPanelLeft,
        },
        {
            title: "Gemelo digital",
            url: "/gemelo",
            icon: Sparkle,
        },
    ],

}

export function AppSidebar() {
    return (
        <Sidebar>
            <HeaderSidebar />
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
        </Sidebar>
    )
}
