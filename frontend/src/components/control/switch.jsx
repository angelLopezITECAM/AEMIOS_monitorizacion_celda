import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"


export function SwitchApp({ item }) {
    const { title, defaultValue } = item
    const [value, setValue] = useState(defaultValue)

    const handleChange = () => {
        setValue(!value)
    }
    return (
        <div className="flex items-center justify-between my-4">
            <Label htmlFor="airplane-mode">{title}</Label>
            <Switch id="airplane-mode" checked={value} onCheckedChange={() => handleChange()} />
        </div>
    )
}