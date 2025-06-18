import { Home, FolderKanban, LayoutPanelLeft, TestTubeDiagonal } from "lucide-react"

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
            title: "Inicio",
            url: "/",
            icon: Home,
        },
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
            title: "Hidrógeno",
            url: "#",
            icon: TestTubeDiagonal,
            isActive: true,
            items: [
                {
                    title: "Sensor",
                    url: "https://io.adafruit.com/jfitecam/feeds/h2",
                },
                {
                    title: "Temperatura",
                    url: "https://io.adafruit.com/jfitecam/feeds/t",
                },
            ],
        },
        {
            title: "Panel de control",
            url: "/panel-control",
            icon: LayoutPanelLeft,
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
