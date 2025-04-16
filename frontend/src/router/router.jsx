import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";

import { Custom404 } from "@/errors/404";

import { PageDashboardBombas } from "@/pages/dashboard/bombas";
import { PageDashboardTermopar } from "@/pages/dashboard/termopar";
import { PagePanelControl } from "@/pages/panel-control";
import { PageGemelo } from "@/pages/gemelo";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <PageGemelo />,
            },
        ]
    },
    {
        path: "/dashboard",
        element: <RootLayout />,
        children: [
            {
                path: "bombas",
                element: <PageDashboardBombas />,
            },
            {
                path: "termopar",
                element: <PageDashboardTermopar />,
            },
        ]
    },
    {
        path: "/panel-control",
        element: <RootLayout />,
        children: [
            {
                path: "",
                element: <PagePanelControl />,
            },
        ]
    },
    {
        path: "*",
        element: <Custom404 />,
    }
]);

export function Router() {
    return <RouterProvider router={router} />
}