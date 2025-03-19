
import Canvas from "./canvas";
import { Alertas } from "./alertas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Title } from '@/components/ui/itecam/typography';

export function DashboardGemelo() {
    return <>

        <Title size="lg">Dashboard gemelo</Title>

        <div className="max-h-[85vh] h-[85vh] m-2">

            <iframe src="http://localhost:3003/" className="w-full h-full" />



        </div>
    </>
}