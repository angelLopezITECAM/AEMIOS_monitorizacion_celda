import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Bell, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useState } from "react"

export function SliderVertical({ item }) {

    const { title, defaultValue, min, max, step } = item

    const [value, setValue] = useState(defaultValue)

    const handleSliderChange = (newValue) => {
        setValue(newValue[0])
    }

    const handleInputChange = (e) => {
        const newValue = Number(e.target.value)
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            setValue(newValue)
        }
    }

    return (
        <div className="my-4">
            <div className="flex items-center justify-between mb-4">
                <Label htmlFor={`${title}-slider`}>{title}</Label>
                <Input
                    id={`${title}-input`}
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    className="w-20 text-right"
                    min={min}
                    max={max}
                    step={step}
                />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-2">{max}</span>
                <Slider
                    id={`${title}-slider`}
                    min={min}
                    max={max}
                    step={step}
                    value={[value]}
                    onValueChange={handleSliderChange}
                    orientation="vertical"
                />
                <span className="text-sm text-muted-foreground mt-2">{min}</span>
            </div>
        </div>
    )
}