import { SidebarHeader } from "@/components/ui/sidebar"
import aemiosLogo from "@/assets/img/aemios.avif"

export function HeaderSidebar() {
    return (
        <SidebarHeader>
            <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg text-sidebar-primary-foreground">

                    <img src={aemiosLogo} alt="Logo" className="w-full h-auto object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">AEMIOS</span>
                    <span className="truncate text-xs">Monitor de celda</span>
                </div>
            </div>
        </SidebarHeader>
    )
}
