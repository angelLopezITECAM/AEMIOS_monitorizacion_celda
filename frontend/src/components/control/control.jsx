
import React from "react"
import { SwitchApp } from "./switch"
import { SliderVertical } from "./slider-vertical"
import { Title } from '@/components/ui/itecam/typography';


const itemsSlider = [
    {
        title: "Bomba cátodo",
        defaultValue: [14],
        min: 0,
        max: 100,
        step: 1
    },
    {
        title: "Bomba ánodo",
        defaultValue: [76],
        min: 0,
        max: 100,
        step: 1
    },
]

const itemsSwitch = [
    {
        title: "Bomba cátodo",
        defaultValue: false,
    },
    {
        title: "Bomba ánodo",
        defaultValue: false,
    },
    {
        title: "Controladora",
        defaultValue: false,
    },
]

export function ControlApp() {


    return (
        <div className="max-w-lg mx-auto space-y-4">
            <Title size="lg">Panel de control</Title>
            <div>
                {
                    itemsSwitch.map((item) => (
                        <SwitchApp
                            key={React.useId()}
                            item={item}
                        />
                    ))
                }

                <div className="grid grid-cols-2 gap-4">
                    {
                        itemsSlider.map((item) => (
                            <SliderVertical
                                key={React.useId()}
                                item={item}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}