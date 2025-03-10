import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"


export function Actuadores() {

    const [controls, setControls] = useState({
        "Bomba cátodo": false,
        "Bomba ánodo": false,
        "Controladora": false,
    });

    const toggleControl = (control) => {
        setControls((prev) => ({ ...prev, [control]: !prev[control] }))
    }

    return (
        <div className="space-y-4">
            {
                Object.entries(controls).map(([control, value]) => (
                    <div key={control} className="flex items-center justify-between">
                        <Label htmlFor="airplane-mode">{control}</Label>
                        <Switch id="airplane-mode" checked={value} onCheckedChange={() => toggleControl(control)} />
                    </div>
                ))
            }

            <Slider defaultValue={[33]} max={100} step={1} />
            <Slider defaultValue={[33]} max={100} step={1} />
        </div>
    )
}