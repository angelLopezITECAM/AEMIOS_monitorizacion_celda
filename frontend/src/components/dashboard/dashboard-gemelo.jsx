
import Canvas from "./canvas";
import { Alertas } from "./alertas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Title } from '@/components/ui/itecam/typography';
import { useState } from "react";

export function DashboardGemelo() {

    const [isLoading, setIsLoading] = useState(true)
    return <>

        <Title size="lg">Inicio</Title>

        <div className="max-h-[85vh] h-[85vh] m-2">

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-lg font-medium">Cargando modelo 3D...</span>
                </div>
            )}

            <iframe
                src="http://192.168.15.109:3003/"
                className="w-full h-full"
                onLoad={() => setIsLoading(false)} />

        </div>
    </>
}