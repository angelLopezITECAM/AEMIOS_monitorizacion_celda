
import Canvas from "./canvas";
import { Alertas } from "./alertas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Title } from '@/components/ui/itecam/typography';

export function DashboardGemelo() {
    return <>

        <Title size="lg">Dashboard gemelo</Title>

        <div className="grid grid-cols-4 grid-rows-3 max-h-[85vh] h-[85vh] m-2">

            <Card className="col-span-4 row-span-3 rounded-none">
                <CardHeader>
                    <CardTitle>Monitor celda</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                    {/* <Canvas /> */}
                    <iframe src="http://localhost:5173/" className="w-full h-full" />
                </CardContent>
            </Card>



        </div>
    </>
}